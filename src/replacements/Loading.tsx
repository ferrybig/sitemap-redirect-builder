import { useContext, useMemo, useSyncExternalStore } from 'react'
import ReplacementSuggestionsContext from './ReplacementSuggestionsContext';
import classes from './Loading.module.css';
import ui from '../components/ui.module.css';

function timeLeft(milliseconds: number) {
	if (milliseconds < 1000) {
		return 'less than a second'
	}
	if (milliseconds < 2000) {
		return '1 second'
	}
	if (milliseconds < 60 * 1000) {
		return Math.floor(milliseconds/1000) + ' seconds'
	}
	const minutes = Math.floor(milliseconds/1000/60);
	const seconds = Math.floor(milliseconds/1000 - minutes * 60);
	return minutes + ' minute' + (minutes > 1 ? 's' : '') + ' and ' + seconds + ' second' + (seconds > 1 ? 's' : '');
}

function Loading() {
	const context = useContext(ReplacementSuggestionsContext);
	if (!context) throw new Error('Context missing');
	const stats = useSyncExternalStore(context.onUpdate, context.getPerformanceStatistics, context.getPerformanceStatistics);
	return useMemo(() => stats.done ? null : (
		<div className={classes.root} role="status">
			<div className={classes.text}>
				<span className={classes.spinner} aria-hidden/>
				<span className={classes.title}>Generating suggestions</span>
				<span className={classes.count}>{stats.finished}/{stats.total}</span>
				{stats.finished > 0 && (
					<span className={classes.subTitle}>
						· about {timeLeft((stats.updateTime - stats.startTime) / stats.finished * (stats.total - stats.finished))} remaining
					</span>
				)}
			</div>
			<div className={ui.progress}>
				<div className={ui.progressBar} style={{ width: `${stats.total === 0 ? 0 : stats.finished / stats.total * 100}%` }}/>
			</div>
		</div>
	), [stats]);
}
export default Loading
