import { createContext } from 'react'
export interface ReplacementSuggestionsContextStatistics {
	done: boolean,
	total: number,
	finished: number,
	startTime: number,
	updateTime: number,
}
interface ReplacementSuggestionsContext {
	getSuggestionsForUrl(url: string): readonly (readonly [string, number])[]
	isDone(): boolean
	getFinishedTasks(): number;
	getTotalTasks(): number;
	onUpdate(callback: () => void): () => void
	getPerformanceStatistics(): ReplacementSuggestionsContextStatistics
}

const ReplacementSuggestionsContext = createContext<ReplacementSuggestionsContext | null>(null);
export default ReplacementSuggestionsContext