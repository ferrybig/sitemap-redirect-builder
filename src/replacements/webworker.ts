import { MessageFromWorker, MessageToWorker } from './webworkerTypes'
import findBestUrls, { buildCache } from './findBestUrls';

let cache: Record<string, Set<string>> = {};
let mutationId = 0;
let oldUrls: readonly string[] = [];
let taskQueue: readonly string[] = [];
let taskQueueIndex = 0;
let queued = false;
function runFromSchedule() {
	queued = false;

	const stopAt = Date.now() + 1000;
	const results: [string, readonly (readonly [string, number])[]][] = [];
	while (taskQueueIndex < taskQueue.length && stopAt > Date.now()) {
		const newUrl = taskQueue[taskQueueIndex++];
		const res = findBestUrls(oldUrls, newUrl, cache);
		results.push([newUrl, res])
	}
	postMessage({
		mutationId,
		results,
		type: 'results',
		processed: taskQueueIndex,
	} satisfies MessageFromWorker)
	if (taskQueueIndex < taskQueue.length ) {
		checkSchedule();
	}
}
function checkSchedule() {
	if (!queued) {
		setTimeout(runFromSchedule);
		queued = true;
	}
}
onmessage = (e) => {
	const message = e.data as MessageToWorker
	console.log('Page --> Worker', message)
	switch(message.type) {
	case 'reset':
		oldUrls = message.old;
		mutationId = message.mutationId
		taskQueue = [...message.new];
		taskQueueIndex = 0;
		cache = buildCache(oldUrls, taskQueue);

		postMessage({
			type: 'started',
			mutationId,
		} satisfies MessageFromWorker);
		if (!queued) runFromSchedule();
		break;
	case 'stop':
		taskQueue = [];
		taskQueueIndex = 0;
		break;
	}
};
