import { Dispatch, SetStateAction, useId } from 'react';
import { Replacement, Sitemap } from '../types';
import ReplacementRow from './ReplacementRow';
import classes from './Replacements.module.css';
import Loading from './Loading';

interface Replacements {
	newSitemap: Sitemap;
	unmatchedReplacements: Replacement[],
	replacements: Replacement[];
	requiredUrls: string[],
	onChange: Dispatch<SetStateAction<Replacement[]>>;
}

function Replacements({
	newSitemap,
	replacements,
	unmatchedReplacements,
	requiredUrls,
	onChange,
}: Replacements) {
	const newUrlsId = useId();
	return (
		<>
			<Loading/>
			<p className={classes.subTitle}>Now map all unknown entries to the url's in the new sitemap</p>
			<datalist id={newUrlsId}>
				{newSitemap.urls.map((url) => <option key={url} value={url}/>)}
			</datalist>
			{unmatchedReplacements.length === 0 && requiredUrls.length === 0 && (
				<div className={newSitemap.urls.length > 0 ? classes.info : classes.warning}>
					{newSitemap.urls.length > 0 ? (
						'Congratulations, all url\'s in the old sitemap are also found in the new sitemap, you will have no issues after the new website is deployed!'
					) : (
						'⚠️ Please provide your old and new sitemaps to starts the analysis! ⚠️'
					)}
				</div>
			)}
			<div>
				{unmatchedReplacements.map((entry) => (
					<ReplacementRow
						key={entry.from}
						from={entry.from}
						replacement={entry}
						onChange={onChange}
						newUrlsId={newUrlsId}
						lost
					/>
				))}
				{requiredUrls.map((url) => (
					<ReplacementRow
						key={url}
						from={url}
						replacement={
							replacements.find(
								(replacement) =>
									replacement.from === url
							) ?? null
						}
						onChange={onChange}
						lost={false}
						newUrlsId={newUrlsId}
					/>
				))}
			</div>
		</>
	);
}

export default Replacements;
