import { Dispatch, SetStateAction, useId } from "react";
import { Replacement, Sitemap } from "./types";
import findBestUrls from "./findBestUrls";
import classes from "./ReplacementRow.module.css";



interface ReplacementRow {
	from: string;
	to: Replacement | null;
	onChange: Dispatch<SetStateAction<Replacement[]>>;
	newSiteMap: Sitemap;
}
function ReplacementRow({
	from,
	to,
	onChange,
	newSiteMap,
}: ReplacementRow) {
	const suggestedUrls = findBestUrls(newSiteMap, from);
	const newUrlsId = useId();
	const id404 = useId();
	function setState(dispatch: SetStateAction<Replacement | null>) {
		onChange((prevReplacements) => {
			const newReplacements = [...prevReplacements];
			const index = newReplacements.findIndex(replacement => replacement.from === from);
			const entry = dispatch instanceof Function ? dispatch(newReplacements[index] ?? null) : dispatch;
			if (index === -1) {
				if (entry !== null) {
					newReplacements.push(entry);
				} else {
					return prevReplacements;
				}
			} else {
				if(entry === null) {
					newReplacements.splice(index, 1);
				} else {
					newReplacements[index] = entry;
				}
			}
			return newReplacements;
		});
	}
	const suggestionIds = [useId(), useId(), useId()];
	const topSuggestions = suggestedUrls.slice(0, suggestionIds.length);
	const pickedTopSuggestion = topSuggestions.find(([url]) => url === to?.to);
	return (
		<tr className={to === null ? classes.needAttention : undefined}>
			<th className={classes.title}><code>{from}</code></th>
			<td className={classes.main}>
				<datalist id={newUrlsId}>
					{suggestedUrls.map(([url]) => <option key={url} value={url}/>)}
				</datalist>
				{topSuggestions.map(([url, score], i) => (
					<p className={classes.option}>
						<input type="radio" checked={to?.to === url || false} id={suggestionIds[i]} onClick={() => setState({ from, to: url })}/>
						<label htmlFor={suggestionIds[i]}>Suggested: <code>{url}</code> {Math.round(score * 100)}%</label>
					</p>
				))}
				<p className={classes.option}>
					<input type="radio" checked={to && to.to === null || false} id={id404} onClick={() => setState({ from, to: null })}/>
					<label htmlFor={id404}>Mark as 404</label>
				</p>
				<p className={classes.option}>
					<input type="radio" checked={typeof to?.to === 'string' && !pickedTopSuggestion} id={id404} onClick={() => setState(old => ({ from, to: old?.to ?? '/' }))}/>
					<input value={to?.to ?? ""} onChange={e => setState({ from, to: e.target.value })} list={newUrlsId}/>
				</p>
				<p className={classes.option}>
					<button disabled={to === null} onClick={() => setState(null)}>Delete rule</button>
				</p>
			</td>
		</tr>
	);
}
export default ReplacementRow