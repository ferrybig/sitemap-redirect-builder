import { Dispatch, SetStateAction, useId } from "react";
import { Replacement, Sitemap } from "./types";
import ReplacementRow from "./ReplacementRow";
import classes from "./Replacements.module.css";

interface Replacements {
	oldSitemap: Sitemap;
	newSitemap: Sitemap;
	replacements: Replacement[];
	onChange: Dispatch<SetStateAction<Replacement[]>>;
}

function Replacements({
	oldSitemap,
	newSitemap,
	replacements,
	onChange,
}: Replacements) {
	const newUrlsId = useId();
	const requiredUrls = oldSitemap.urls.filter(
		(oldUrl) => !newSitemap.urls.find((newUrl) => newUrl === oldUrl)
	);
	const missingUrls = requiredUrls.filter(
		(requiredUrl) =>
			!replacements.find(
				(replacement) => replacement.from === requiredUrl
			)
	);
	const unmatchedReplacements = replacements.filter(
		(replacement) =>
			!requiredUrls.find((oldUrl) => oldUrl === replacement.from)
	);
	return (
		<div>
			{missingUrls.length > 0 && (
				<p>
					<strong>Warning: </strong>
					{missingUrls.length} urls are not yet mapped!
				</p>
			)}
			<table className={classes.table}>
				<thead>
					<tr>
						<th>From</th>
						<th>To</th>
					</tr>
				</thead>
				<tbody>
					{unmatchedReplacements.map((url) => (
						<ReplacementRow
							key={url.from}
							from={url.from}
							to={
								replacements.find(
									(replacement) =>
										replacement.from === url.from
								) ?? null
							}
							onChange={onChange}
							newSiteMap={newSitemap}
						/>
					))}
					{requiredUrls.map((url) => (
						<ReplacementRow
							key={url}
							from={url}
							to={
								replacements.find(
									(replacement) =>
										replacement.from === url
								) ?? null
							}
							onChange={onChange}
							newSiteMap={newSitemap}
						/>
					))}
				</tbody>
			</table>
			<datalist id={newUrlsId}>
				{newSitemap.urls.map((url) => (
					<option key={url} value={url} />
				))}
			</datalist>
		</div>
	);
}

export default Replacements;
