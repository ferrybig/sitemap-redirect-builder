import { Dispatch, useState } from 'react';
import { OutputGenerator, Replacement } from '../types';
import classes from './Output.module.css';

const LANGUAGES = Object.fromEntries(Object
	.entries(import.meta.glob<Record<string, OutputGenerator>>('./generators/*.ts', { eager: true}))
	.flatMap(([file, value]) => Object.entries(value)
		.map(([exportedName, generator]) => [file + '#' + exportedName, generator])
	)
);
const LANGUAGES_ENTRIES = Object.entries(LANGUAGES);

interface OutputLanguagePicker {
	setLanguage: Dispatch<string>
}
function OutputLanguagePicker({setLanguage}: OutputLanguagePicker) {
	return (
		<ul className={classes.outputSelector}>
			{LANGUAGES_ENTRIES.map(([key, value]) => (
				<li key={key} className={classes.outputSelectorItem}>
					<button className={classes.outputSelectorTile} onClick={() => setLanguage(key)}>
						{value.image && <div className={classes.outputSelectorTileImage} style={{
							backgroundImage: `url(${value.image.src})`,
							...value.image.pos ? {
								backgroundPosition: `${value.image.pos.x}px ${value.image.pos.y}px`,
								backgroundSize: `${value.image.pos.width}px ${value.image.pos.height}px`,
							} : {},
						}}/>}
						<p className={classes.outputSelectorTileName}>{value.name}</p>
					</button>
				</li>
			))}
		</ul>
	)
}

interface Output {
	replacements: Replacement[];
	missingUrls: string[]
}

function Output({
	replacements,
	missingUrls
}: Output) {
	const [language, setLanguage] = useState<keyof typeof LANGUAGES | null>(null);
	return (
		<>
			<p className={classes.subTitle}>The output of the mapping</p>
			{missingUrls.length > 0 && (
				<p className={classes.warning}>
					<strong>Warning: </strong>
					{missingUrls.length} urls are not yet mapped!
					{' '}
					<button onClick={() => document.getElementById('map' + missingUrls[0])?.focus()}>Jump to the next entry</button>
				</p>
			)}
			{language !== null && (
				<select value={language} onChange={(e) => setLanguage(e.currentTarget.value)}>
					{LANGUAGES_ENTRIES.map(([key, generator]) => (
						<option key={key} value={key}>
							{generator.name}
						</option>
					))}
				</select>
			)}
			<div className={classes.fullScreenSection}>
				{language === null ? (
					<OutputLanguagePicker setLanguage={setLanguage}/>
				) : (
					<textarea className={classes.output} value={LANGUAGES[language].generateOutput(replacements)} readOnly/>
				)}
			</div>
		</>
	);
}
export default Output;