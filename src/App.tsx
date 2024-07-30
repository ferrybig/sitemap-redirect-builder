import { Ref, useDeferredValue, useRef, useState } from 'react'
import parseSitemap from './input/parseSitemap'
import Replacements from './replacements/Replacements'
import { Replacement, Sitemap as SitemapType } from './types'
import Output from './output/Output'
import classes from './App.module.css'
import Sitemap from './input/Sitemap'
import NextSectionButton from './components/NextSectionButton'
import ReplacementSuggestions from './replacements/ReplacementSuggestions'

interface AppLogic {
	parsedOldSitemap: SitemapType
	parsedNewSitemap: SitemapType
	thirdSectionRef: Ref<HTMLDivElement>
}
function AppLogic({
	parsedNewSitemap,
	parsedOldSitemap,
	thirdSectionRef,
}: AppLogic) {

	const fourthSectionRef = useRef<HTMLDivElement>(null);
	const [replacements, setReplacements] = useState<Replacement[]>([])
	const requiredUrls = parsedOldSitemap.urls.filter(
		(oldUrl) => !parsedNewSitemap.urls.find((newUrl) => newUrl === oldUrl)
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

	const stage =
	parsedOldSitemap.type === 'error' ? 1 :
	parsedNewSitemap.type === 'error' ? 2 :
	missingUrls.length !== 0 ? 3 :
	4

	return (
		<>
			<div className={stage < 3 ? classes.sectionInactive : classes.section} ref={thirdSectionRef}>
				<h2>3. Replacements</h2>
				<Replacements
					requiredUrls={requiredUrls}
					unmatchedReplacements={unmatchedReplacements}
					newSitemap={parsedNewSitemap}
					replacements={replacements}
					onChange={setReplacements}
				/>
				<NextSectionButton nextRef={fourthSectionRef} enabled={stage >= 4}>
					view generated output
				</NextSectionButton>
			</div>
			<div className={stage < 4 ? classes.outputInactive : classes.output} ref={fourthSectionRef}>
				<h2>4. Output</h2>
				<Output missingUrls={missingUrls} replacements={replacements}/>
			</div>
		</>
	)
}
function App() {
	const [oldSitemap, setOldSitemap] = useState('')
	const [newSitemap, setNewSitemap] = useState('')
	const firstSection = useRef<HTMLDivElement>(null);
	const secondSection = useRef<HTMLDivElement>(null);
	const thirdSection = useRef<HTMLDivElement>(null);

	const parsedOldSitemap = parseSitemap(oldSitemap);
	const parsedNewSitemap = parseSitemap(newSitemap);

	const stage =
		parsedOldSitemap.type === 'error' ? 1 :
		parsedNewSitemap.type === 'error' ? 2 :
		3

	const appLogic = (

		<AppLogic
			parsedNewSitemap={parsedNewSitemap}
			parsedOldSitemap={parsedOldSitemap}
			thirdSectionRef={thirdSection}
		/>
	)
	const appLogicDeferred = useDeferredValue(appLogic);
	const isLoading = appLogic !== appLogicDeferred;

	return (
		<>
			<div className={classes.titleSection}>
				<img src='./favicon.svg' width={400} height={400} alt=""/>
				<div>
					<h1>Sitemap redirect builder</h1>
					<p>Provides redirect scripts for common http server. To use this tool provide your old and new sitemaps, then define replacements for the missing url's from the new sitemap</p>
				</div>
				<NextSectionButton nextRef={firstSection} enabled>
					Provide original sitemap
				</NextSectionButton>
			</div>
			<div className={classes.section} ref={firstSection}>
				<h2>1. Old sitemap</h2>
				<Sitemap
					label='Provide the old sitemap here'
					parsedSitemap={parsedOldSitemap}
					setSitemap={setOldSitemap}
					sitemap={oldSitemap}
					exampleIndex={0}
				/>
				<NextSectionButton nextRef={secondSection} enabled={stage >= 2}>
					Provide updated sitemap
				</NextSectionButton>
			</div>
			<div className={stage < 2 ? classes.sectionInactive : classes.section} ref={secondSection}>
				<h2>2. New sitemap</h2>
				<Sitemap
					label='Provide the new sitemap here'
					parsedSitemap={parsedNewSitemap}
					setSitemap={setNewSitemap}
					sitemap={newSitemap}
					exampleIndex={1}
				/>
				<NextSectionButton nextRef={thirdSection} enabled={stage >= 3}>
					Define replacement
				</NextSectionButton>
			</div>
			<div className={classes.logicHolder}>
				<div className={isLoading ? classes.loading : undefined}/>
				<ReplacementSuggestions
					newSitemap={parsedNewSitemap}
					oldSitemap={parsedOldSitemap}
				>
					{appLogicDeferred}
				</ReplacementSuggestions>
			</div>
			<div className={classes.footer}>
				<p>
					This website is open source:
					{' '}
					<a href='https://github.com/ferrybig/sitemap-redirect-builder'>ferrybig/sitemap-redirect-builder</a>
					.
				</p>
				<p>
					The icons in the output section come from
					{' '}
					<a href='https://github.com/vscode-icons/vscode-icons'>vscode-icons/vscode-icons</a>
					{' '}
					and are licensed under the MIT license
				</p>
			</div>
		</>
	)
}


export default App
