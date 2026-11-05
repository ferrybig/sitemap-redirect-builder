import { Dispatch, SetStateAction, useId, useState } from 'react';
import { Replacement, Sitemap } from '../types';
import ReplacementRow from './ReplacementRow';
import classes from './Replacements.module.css';
import ui from '../components/ui.module.css';
import Loading from './Loading';
import Icon from '../components/Icon';
import { focusRowByUrl } from './focusRow';

type Filter = 'all' | 'unmapped';

interface Replacements {
	sitemapsReady: boolean;
	newSitemap: Sitemap;
	unmatchedReplacements: Replacement[],
	replacements: Replacement[];
	requiredUrls: string[],
	missingUrls: string[],
	onChange: Dispatch<SetStateAction<Replacement[]>>;
}

function Replacements({
	sitemapsReady,
	newSitemap,
	replacements,
	unmatchedReplacements,
	requiredUrls,
	missingUrls,
	onChange,
}: Replacements) {
	const newUrlsId = useId();
	const [filter, setFilter] = useState<Filter>('all');
	// When filtering on unmapped rows, rows that get mapped stay visible until the filter is applied again,
	// so they do not disappear from under the cursor
	const [pinned, setPinned] = useState<ReadonlySet<string>>(() => new Set());

	if (!sitemapsReady) {
		return (
			<div className={ui.empty}>
				<Icon name="info" size={24}/>
				Provide both sitemaps above to see which URLs need a redirect.
			</div>
		);
	}
	if (unmatchedReplacements.length === 0 && requiredUrls.length === 0) {
		return (
			<div className={ui.emptySuccess}>
				<Icon name="check" size={28}/>
				<strong>Nothing to map</strong>
				Every URL in the old sitemap also exists in the new sitemap, so no redirects are needed.
			</div>
		);
	}

	const missing = new Set(missingUrls);
	const isVisible = (url: string) => filter === 'all' || missing.has(url) || pinned.has(url);
	const visibleCustomRules = unmatchedReplacements.filter((entry) => isVisible(entry.from));
	const visibleRequired = requiredUrls.filter(isVisible);
	const replacementByUrl = new Map(replacements.map((replacement) => [replacement.from, replacement]));

	const mappedCount = requiredUrls.length - missingUrls.length;
	const percentage = requiredUrls.length === 0 ? 100 : mappedCount / requiredUrls.length * 100;
	const complete = missingUrls.length === 0;

	function changeFilter(newFilter: Filter) {
		setFilter(newFilter);
		setPinned(new Set(newFilter === 'unmapped' ? missingUrls : []));
	}

	return (
		<>
			<Loading/>
			<div className={classes.toolbar}>
				<div className={classes.progress}>
					<p className={classes.progressText}>
						<strong>{mappedCount}</strong> of <strong>{requiredUrls.length}</strong> missing URLs mapped
						{complete && <span className={ui.chipSuccess}><Icon name="check" size={12}/> Complete</span>}
					</p>
					<div
						className={ui.progress}
						role="progressbar"
						aria-valuemin={0}
						aria-valuemax={requiredUrls.length}
						aria-valuenow={mappedCount}
						aria-label="Mapped URLs"
					>
						<div className={complete ? ui.progressBarDone : ui.progressBar} style={{ width: `${percentage}%` }}/>
					</div>
				</div>
				<div className={classes.toolbarActions}>
					<div className={classes.segmented} role="group" aria-label="Filter rows">
						<button
							type="button"
							className={filter === 'all' ? classes.segmentActive : classes.segment}
							aria-pressed={filter === 'all'}
							onClick={() => changeFilter('all')}
						>
							All <span className={classes.count}>{requiredUrls.length + unmatchedReplacements.length}</span>
						</button>
						<button
							type="button"
							className={filter === 'unmapped' ? classes.segmentActive : classes.segment}
							aria-pressed={filter === 'unmapped'}
							onClick={() => changeFilter('unmapped')}
						>
							Unmapped <span className={classes.count}>{missingUrls.length}</span>
						</button>
					</div>
					<button
						type="button"
						className={`${ui.primary} ${ui.small}`}
						disabled={complete}
						onClick={() => focusRowByUrl(missingUrls[0])}
					>
						Next unmapped
						<Icon name="arrowRight" size={14}/>
					</button>
				</div>
			</div>
			<p className={classes.shortcuts}>
				<Icon name="keyboard" size={16}/>
				<span>
					With a row focused, press
					{' '}<kbd className={ui.kbd}>1</kbd>–<kbd className={ui.kbd}>3</kbd> to pick a suggestion,
					{' '}<kbd className={ui.kbd}>g</kbd> to mark as gone,
					{' '}<kbd className={ui.kbd}>i</kbd> to ignore or
					{' '}<kbd className={ui.kbd}>/</kbd> to type a custom URL.
					{' '}Focus then moves to the next row.
				</span>
			</p>
			<datalist id={newUrlsId}>
				{newSitemap.urls.map((url) => <option key={url} value={url}/>)}
			</datalist>
			{visibleCustomRules.length === 0 && visibleRequired.length === 0 ? (
				<div className={ui.emptySuccess}>
					<Icon name="check" size={28}/>
					<strong>All URLs are mapped</strong>
					<button type="button" className={`${ui.button} ${ui.small}`} onClick={() => changeFilter('all')}>
						Show all rows
					</button>
				</div>
			) : (
				<div className={classes.list}>
					{visibleCustomRules.map((entry) => (
						<ReplacementRow
							key={entry.from}
							from={entry.from}
							replacement={entry}
							onChange={onChange}
							newUrlsId={newUrlsId}
							lost
						/>
					))}
					{visibleRequired.map((url) => (
						<ReplacementRow
							key={url}
							from={url}
							replacement={replacementByUrl.get(url) ?? null}
							onChange={onChange}
							lost={false}
							newUrlsId={newUrlsId}
						/>
					))}
				</div>
			)}
		</>
	);
}

export default Replacements;
