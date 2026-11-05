import { Dispatch, useEffect, useState } from 'react';
import { OutputGenerator, Replacement } from '../types';
import classes from './Output.module.css';
import ui from '../components/ui.module.css';
import Icon from '../components/Icon';
import { focusRowByUrl } from '../replacements/focusRow';

const LANGUAGES = Object.fromEntries(Object
	.entries(import.meta.glob<Record<string, OutputGenerator>>('./generators/*.ts', { eager: true}))
	.flatMap(([file, value]) => Object.entries(value)
		.map(([exportedName, generator]) => [file + '#' + exportedName, generator])
	)
);
const LANGUAGES_ENTRIES = Object.entries(LANGUAGES);

interface OutputLanguagePicker {
	language: string | null
	setLanguage: Dispatch<string>
}
function OutputLanguagePicker({ language, setLanguage }: OutputLanguagePicker) {
	return (
		<div className={classes.picker} role="group" aria-label="Web server">
			{LANGUAGES_ENTRIES.map(([key, value]) => (
				<button
					key={key}
					type="button"
					className={language === key ? classes.tileActive : classes.tile}
					aria-pressed={language === key}
					onClick={() => setLanguage(key)}
				>
					{value.image && <span className={classes.tileImage} aria-hidden style={{
						backgroundImage: `url(${value.image.src})`,
						...value.image.pos ? {
							backgroundPosition: `${value.image.pos.x}px ${value.image.pos.y}px`,
							backgroundSize: `${value.image.pos.width}px ${value.image.pos.height}px`,
						} : {},
					}}/>}
					<span className={classes.tileText}>
						<span className={classes.tileName}>{value.name}</span>
						{value.fileName && <span className={classes.tileFile}>{value.fileName}</span>}
					</span>
					{language === key && <Icon name="check" size={16} className={classes.tileCheck}/>}
				</button>
			))}
		</div>
	)
}

type CopyState = 'idle' | 'copied' | 'failed';

interface Output {
	sitemapsReady: boolean;
	replacements: Replacement[];
	missingUrls: string[]
}

function Output({
	sitemapsReady,
	replacements,
	missingUrls
}: Output) {
	const [language, setLanguage] = useState<string | null>(null);
	const [copyState, setCopyState] = useState<CopyState>('idle');

	useEffect(() => {
		if (copyState === 'idle') return;
		const timeout = setTimeout(() => setCopyState('idle'), 2000);
		return () => clearTimeout(timeout);
	}, [copyState]);

	const generator = language === null ? null : LANGUAGES[language];
	const output = generator ? generator.generateOutput(replacements) : '';
	const fileName = generator?.fileName ?? 'redirects.txt';
	const ruleCount = replacements.filter((replacement) => replacement.to !== undefined).length;

	async function copy() {
		try {
			await navigator.clipboard.writeText(output);
			setCopyState('copied');
		} catch {
			setCopyState('failed');
		}
	}
	function download() {
		const url = URL.createObjectURL(new Blob([output], { type: 'text/plain' }));
		const link = document.createElement('a');
		link.href = url;
		link.download = fileName;
		link.click();
		setTimeout(() => URL.revokeObjectURL(url), 0);
	}

	return (
		<>
			{sitemapsReady && missingUrls.length > 0 && (
				<div className={ui.alertWarning}>
					<Icon name="alert" size={18}/>
					<span className={ui.alertText}>
						<strong>{missingUrls.length} URL{missingUrls.length === 1 ? '' : 's'}</strong>
						{' '}still need{missingUrls.length === 1 ? 's' : ''} a mapping and {missingUrls.length === 1 ? 'is' : 'are'} not included below.
					</span>
					<button type="button" className={`${ui.button} ${ui.small}`} onClick={() => focusRowByUrl(missingUrls[0])}>
						Go to next unmapped
						<Icon name="arrowRight" size={14}/>
					</button>
				</div>
			)}
			<OutputLanguagePicker language={language} setLanguage={setLanguage}/>
			{generator === null ? (
				<div className={ui.empty}>
					<Icon name="server" size={24}/>
					Choose your web server above to generate its configuration.
				</div>
			) : (
				<div className={classes.code}>
					<div className={classes.codeHeader}>
						<span className={classes.codeFile}>
							<Icon name="file" size={14}/>
							{fileName}
						</span>
						<span className={classes.codeMeta}>
							{ruleCount} rule{ruleCount === 1 ? '' : 's'}
						</span>
						<div className={classes.codeActions}>
							<button type="button" className={`${ui.ghost} ${ui.small}`} onClick={download} disabled={output === ''}>
								<Icon name="download" size={14}/>
								Download
							</button>
							<button type="button" className={`${ui.primary} ${ui.small}`} onClick={copy} disabled={output === ''}>
								<Icon name={copyState === 'copied' ? 'check' : 'copy'} size={14}/>
								{copyState === 'copied' ? 'Copied!' : copyState === 'failed' ? 'Copy failed' : 'Copy'}
							</button>
						</div>
					</div>
					{output === '' ? (
						<p className={classes.codeEmpty}>
							No rules yet. Map some URLs in step 3 to generate redirect rules.
						</p>
					) : (
						<pre className={classes.pre} tabIndex={0} aria-label={`Generated ${generator.name} configuration`}>
							<code>{output}</code>
						</pre>
					)}
				</div>
			)}
		</>
	);
}
export default Output;
