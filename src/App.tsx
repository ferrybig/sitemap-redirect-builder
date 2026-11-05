import { useDeferredValue, useRef, useState } from 'react'
import parseSitemap from './input/parseSitemap'
import Replacements from './replacements/Replacements'
import { Replacement, Sitemap as SitemapType } from './types'
import Output from './output/Output'
import classes from './App.module.css'
import Sitemap from './input/Sitemap'
import ReplacementSuggestions from './replacements/ReplacementSuggestions'
import Header from './components/Header'
import Section from './components/Section'
import Icon from './components/Icon'

function analyse(oldSitemap: SitemapType, newSitemap: SitemapType, replacements: Replacement[]) {
	const newUrls = new Set(newSitemap.urls);
	const requiredUrls = oldSitemap.urls.filter((oldUrl) => !newUrls.has(oldUrl));
	const requiredSet = new Set(requiredUrls);
	const mapped = new Set(replacements.map((replacement) => replacement.from));
	const missingUrls = requiredUrls.filter((requiredUrl) => !mapped.has(requiredUrl));
	const unmatchedReplacements = replacements.filter((replacement) => !requiredSet.has(replacement.from));
	return { requiredUrls, missingUrls, unmatchedReplacements };
}

function plural(count: number, word: string) {
	return `${count} ${word}${count === 1 ? '' : 's'}`;
}

function App() {
	const [oldSitemap, setOldSitemap] = useState('')
	const [newSitemap, setNewSitemap] = useState('')
	const [replacements, setReplacements] = useState<Replacement[]>([])
	const oldSection = useRef<HTMLElement>(null);
	const newSection = useRef<HTMLElement>(null);
	const replacementsSection = useRef<HTMLElement>(null);
	const outputSection = useRef<HTMLElement>(null);

	const parsedOldSitemap = parseSitemap(oldSitemap);
	const parsedNewSitemap = parseSitemap(newSitemap);

	// Rendering a large list of replacement rows can be slow, so the parts that depend on the sitemaps
	// are rendered with a deferred copy, keeping the text areas responsive while typing
	const deferredOldSitemap = useDeferredValue(parsedOldSitemap);
	const deferredNewSitemap = useDeferredValue(parsedNewSitemap);
	const isLoading = deferredOldSitemap !== parsedOldSitemap || deferredNewSitemap !== parsedNewSitemap;

	const { requiredUrls, missingUrls, unmatchedReplacements } = analyse(deferredOldSitemap, deferredNewSitemap, replacements);

	const sitemapsReady = deferredOldSitemap.type === 'success' && deferredNewSitemap.type === 'success';
	const mappingDone = sitemapsReady && missingUrls.length === 0;

	return (
		<>
			<Header
				steps={[
					{
						label: 'Old sitemap',
						detail: parsedOldSitemap.type === 'success' ? plural(parsedOldSitemap.urls.length, 'URL') : 'Not provided',
						done: parsedOldSitemap.type === 'success',
						targetRef: oldSection,
					},
					{
						label: 'New sitemap',
						detail: parsedNewSitemap.type === 'success' ? plural(parsedNewSitemap.urls.length, 'URL') : 'Not provided',
						done: parsedNewSitemap.type === 'success',
						targetRef: newSection,
					},
					{
						label: 'Map URLs',
						detail: sitemapsReady ? `${requiredUrls.length - missingUrls.length} of ${requiredUrls.length} mapped` : 'Waiting for sitemaps',
						done: mappingDone,
						targetRef: replacementsSection,
					},
					{
						label: 'Export',
						detail: mappingDone ? 'Ready' : 'Not ready yet',
						done: false,
						targetRef: outputSection,
					},
				]}
			/>
			<main className={classes.main} id="top">
				<div className={classes.hero}>
					<div className={classes.heroText}>
						<h1 className={classes.heroTitle}>Keep every old link working after a site migration</h1>
						<p className={classes.heroLead}>
							Paste the sitemaps of your old and new website. This tool finds the URLs that disappeared,
							suggests where they should go, and generates redirect rules for your web server.
						</p>
						<ul className={classes.heroFeatures}>
							<li><Icon name="shield"/> Runs entirely in your browser</li>
							<li><Icon name="sparkles"/> Smart replacement suggestions</li>
							<li><Icon name="server"/> Apache, Nginx, Caddy &amp; JSON output</li>
						</ul>
					</div>
					<img className={classes.heroImage} src="./favicon.svg" width={400} height={400} alt=""/>
				</div>

				<div className={classes.inputs}>
					<Section
						sectionRef={oldSection}
						step={1}
						title="Old sitemap"
						description="The sitemap of the website that is live today."
						done={parsedOldSitemap.type === 'success'}
					>
						<Sitemap
							label="Old sitemap XML"
							parsedSitemap={parsedOldSitemap}
							setSitemap={setOldSitemap}
							sitemap={oldSitemap}
							exampleIndex={0}
						/>
					</Section>
					<Section
						sectionRef={newSection}
						step={2}
						title="New sitemap"
						description="The sitemap of the website you are about to deploy."
						done={parsedNewSitemap.type === 'success'}
					>
						<Sitemap
							label="New sitemap XML"
							parsedSitemap={parsedNewSitemap}
							setSitemap={setNewSitemap}
							sitemap={newSitemap}
							exampleIndex={1}
						/>
					</Section>
				</div>

				<ReplacementSuggestions
					newSitemap={parsedNewSitemap}
					oldSitemap={parsedOldSitemap}
				>
					<div className={isLoading ? classes.resultsLoading : classes.results} aria-busy={isLoading}>
						<Section
							sectionRef={replacementsSection}
							step={3}
							title="Map missing URLs"
							description="Choose where each URL that no longer exists should point to."
							done={mappingDone}
						>
							<Replacements
								sitemapsReady={sitemapsReady}
								requiredUrls={requiredUrls}
								missingUrls={missingUrls}
								unmatchedReplacements={unmatchedReplacements}
								newSitemap={deferredNewSitemap}
								replacements={replacements}
								onChange={setReplacements}
							/>
						</Section>
						<Section
							sectionRef={outputSection}
							step={4}
							title="Export redirect rules"
							description="Pick your web server and copy the generated configuration."
						>
							<Output
								sitemapsReady={sitemapsReady}
								missingUrls={missingUrls}
								replacements={replacements}
							/>
						</Section>
					</div>
				</ReplacementSuggestions>
				{isLoading && (
					<div className={classes.toast} role="status">
						<span className={classes.spinner} aria-hidden/>
						Computing differences…
					</div>
				)}
			</main>
			<footer className={classes.footer}>
				<p>
					<Icon name="github"/>
					{' '}
					This website is open source:
					{' '}
					<a href="https://github.com/ferrybig/sitemap-redirect-builder">ferrybig/sitemap-redirect-builder</a>
				</p>
				<p>
					The icons in the output section come from
					{' '}
					<a href="https://github.com/vscode-icons/vscode-icons">vscode-icons/vscode-icons</a>
					{' '}
					and are licensed under the MIT license.
				</p>
			</footer>
		</>
	)
}


export default App
