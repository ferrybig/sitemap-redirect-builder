import { Dispatch, SetStateAction, useId, useRef } from 'react';
import { Replacement } from '../types';
import classes from './ReplacementRow.module.css';
import useSuggestions from '../hooks/useSuggestions';

interface ReplacementRow {
	from: string;
	replacement: Replacement | null;
	onChange: Dispatch<SetStateAction<Replacement[]>>;
	newUrlsId: string
	lost: boolean
}
function ReplacementRow({
	from,
	replacement: to,
	onChange,
	lost,
	newUrlsId,
}: ReplacementRow) {
	const id410 = useId();
	const idIgnore = useId();
	const suggestionIds = [useId(), useId(), useId()];
	const otherId = useId();
	const otherInput = useRef<HTMLInputElement>(null);

	const topSuggestions = useSuggestions(from);
	const pickedTopSuggestion = topSuggestions.find(([url]) => url === to?.to);

	function setState(setStateAction: SetStateAction<Replacement | null>) {
		onChange((prevReplacements) => {
			const newReplacements = [...prevReplacements];
			const index = newReplacements.findIndex(replacement => replacement.from === from);
			const entry = setStateAction instanceof Function ? setStateAction(index >= 0 ? newReplacements[index] : null) : setStateAction;
			if (index === -1) {
				if (entry !== null) {
					newReplacements.push(entry);
				} else {
					return prevReplacements;
				}
			} else {
				if (entry === null) {
					newReplacements.splice(index, 1);
				} else {
					newReplacements[index] = entry;
				}
			}
			return newReplacements;
		});
	}
	return (
		<div className={to === null ? classes.needAttention : classes.root}>
			<p className={classes.from}>
				<button className={classes.delete} disabled={to === null} onClick={() => setState(null)}>{lost ? 'del' : 'reset'}</button>
				<span>
					<code>{from}</code>
					{lost ? ' Custom rule' : ''}
				</span>
			</p>
			{suggestionIds.map((id, i) => topSuggestions.length > i ?  (
				<p className={classes.option} key={id}>
					<label className={classes.kbd} aria-hidden htmlFor={suggestionIds[i]}>{i + 1}</label>
					<input type="radio" name={'from-' + from} checked={to?.to === topSuggestions[i][0] || false} id={id} onChange={() => setState({ from, to: topSuggestions[i][0] })}/>
					<label htmlFor={suggestionIds[i]}><code>{topSuggestions[i][0]}</code> ({Math.round(topSuggestions[i][1] * 100)}% relevance)</label>
				</p>
			) : (
				<p className={classes.option} key={id}>
					<label className={classes.kbd} aria-hidden htmlFor={suggestionIds[i]}>{i + 1}</label>
					<input disabled type="radio" name={'from-' + from} checked={false} id={id}/>
					<label htmlFor={suggestionIds[i]}><em>No suggestion available</em></label>
				</p>
			))}
			<p className={classes.option}>
				<label className={classes.kbd} aria-hidden htmlFor={id410}>g</label>
				<input type="radio" name={'from-' + from} checked={to && to.to === null || false} id={id410} onChange={() => setState({ from, to: null })}/>
				<label htmlFor={id410}>Mark as gone</label>
			</p>
			<p className={classes.option}>
				<label className={classes.kbd} aria-hidden htmlFor={idIgnore}>i</label>
				<input type="radio" name={'from-' + from} checked={to && to.to === undefined || false} id={idIgnore} onChange={() => setState({ from, to: undefined })}/>
				<label htmlFor={idIgnore}>Ignore</label>
			</p>
			<p className={classes.option}>
				<label className={classes.kbd} aria-hidden htmlFor={otherId}>/</label>
				<input type="radio" name={'from-' + from} checked={typeof to?.to === 'string' && !pickedTopSuggestion} id={otherId} onChange={() => {
					setState(old => ({ from, to: old?.to ?? '/' }));
					otherInput.current?.focus();
				}}/>
				<label htmlFor={otherId}>Other: </label>
				<input ref={otherInput} id={'map' + from} value={to?.to ?? ''} onChange={e => setState({ from, to: e.target.value })} list={newUrlsId}/>
			</p>
		</div>
	);
}
export default ReplacementRow