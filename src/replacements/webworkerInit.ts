import { Sitemap } from '../types'
import ReplacementSuggestionsContext, { ReplacementSuggestionsContextStatistics } from './ReplacementSuggestionsContext'
import { MessageFromWorker, MessageToWorker } from './webworkerTypes';
import workerUrl from './webworker?worker&url'

const emptySuggestions: [string, number][] = [];

export interface ReplacementSuggestionsContextWithControl extends ReplacementSuggestionsContext {
	clear(): void
	setSitemaps(
		newSitemap: Sitemap,
		oldSitemap: Sitemap
	): void
}
export default function webworkerInit(): ReplacementSuggestionsContextWithControl {
	let mutationId = 0;
	let worker: Worker | null;
	let results: Record<string, readonly (readonly [string, number])[]> = {};
	const listeners: (() => void)[] = [];
	let taskCount = 0;
	let doneCount = 0;
	let startTime = Date.now();
	let updateTime = Date.now();
	let preloadElement: HTMLLinkElement | null = null;
	let statistics: ReplacementSuggestionsContextStatistics | null = null;
	return {
		clear() {
			mutationId++;
			results = {};
			doneCount = 0;
			taskCount = 0;
			statistics = null;
			worker?.postMessage({ 'type': 'stop' } satisfies MessageToWorker);
		},
		getFinishedTasks() {
			return doneCount;
		},
		getSuggestionsForUrl(url) {
			return results[url] || emptySuggestions;
		},
		getTotalTasks() {
			return taskCount;
		},
		isDone() {
			return taskCount === doneCount;
		},
		onUpdate(callback) {
			listeners.push(callback);
			return () => {
				const index = listeners.indexOf(callback);
				if(index >= 0) listeners.splice(index, 1);
			}
		},
		getPerformanceStatistics() {
			return statistics ??= {
				done: taskCount === doneCount,
				total: taskCount,
				finished: doneCount,
				startTime,
				updateTime,
			}
		},
		setSitemaps(newSitemap, oldSitemap) {
			mutationId++;
			results = {};
			doneCount = 0;
			startTime = updateTime = Date.now()
			taskCount = newSitemap.urls.length;
			statistics = null;
			if (oldSitemap.urls.length === 0 || newSitemap.urls.length === 0) {
				doneCount = taskCount
				if (oldSitemap.urls.length !== 0 || newSitemap.urls.length !== 0) {
					if (!preloadElement) {
						preloadElement = document.createElement('link');
						preloadElement.href = workerUrl;
						preloadElement.rel = 'prefetch'
						preloadElement.as = 'worker'
						document.head.appendChild(preloadElement);
					}
				}
			} else {
				if (!worker) {
					worker = new Worker(workerUrl, {
						type: 'module'
					})
					worker.addEventListener('message', (e) => {
						const message = e.data as MessageFromWorker
						console.log('Worker --> Page', message)
						switch(message.type) {
						case 'results':
							if (message.mutationId !== mutationId) return;
							for(const row of message.results) {
								results[row[0]] = row[1];
							}
							doneCount = message.processed;
							updateTime = Date.now();
							if (doneCount >= taskCount) {
								worker?.terminate();
								worker = null;
							}
							statistics = null;
							for(const entry of listeners) {
								entry();
							}
							break;
						case 'started':
							if (message.mutationId !== mutationId) return;
							startTime = updateTime = Date.now();
							// Do not update listeners here, it is a waste of time
							break;
						default:
							throw new Error('Unexpected event: ' + JSON.stringify(message))
						}
					})
				}
				for (const entry of listeners) {
					entry();
				}
				worker.postMessage({ 'type': 'reset', mutationId, old: oldSitemap.urls, new: newSitemap.urls } satisfies MessageToWorker);
			}
		},
	}

}