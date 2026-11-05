import { useId, useRef } from 'react'
import {Sitemap as SitemapType } from '../types'
import classes from './Sitemap.module.css'
import ui from '../components/ui.module.css'
import useRunAfterInitialRender from '../hooks/useRunAfterInitialRender';
import Icon from '../components/Icon';

const EXAMPLE_HEADER = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

const EXAMPLES = [
	`${EXAMPLE_HEADER}
	<url><loc>https://www.example.com/</loc></url>
	<url><loc>https://www.example.com/contact</loc></url>
	<url><loc>https://www.example.com/blog/2024/my-new-blog</loc></url>
	<url><loc>https://www.example.com/about</loc></url>
</urlset>`,
	`${EXAMPLE_HEADER}
	<url><loc>https://www.example.com/</loc></url>
	<url><loc>https://www.example.com/about-me</loc></url>
	<url><loc>https://www.example.com/blog/my-new-blog</loc></url>
	<url><loc>https://www.example.com/contact</loc></url>
</urlset>`
]

interface Sitemap {
	sitemap: string,
	label: string,
	parsedSitemap: SitemapType
	setSitemap: (value: string) => void
	exampleIndex: 0 | 1
}
function Sitemap({
	label,
	parsedSitemap,
	setSitemap,
	sitemap,
	exampleIndex,
}: Sitemap) {
	const textareaId = useId();
	const statusId = useId();
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	/**
	 * This provides support for F5 in the build version of the app, where the browser auto fills the input with the old data from before the refresh
	 */
	useRunAfterInitialRender(() => {
		if (textAreaRef.current && textAreaRef.current.value !== textAreaRef.current.defaultValue) {
			setSitemap(textAreaRef.current.value);
		}
	})
	const isEmpty = sitemap === '';
	return (
		<div className={classes.root}>
			<div className={classes.toolbar}>
				<label className={classes.label} htmlFor={textareaId}>{label}</label>
				<div className={classes.actions}>
					{!isEmpty && (
						<button type="button" className={`${ui.ghost} ${ui.small}`} onClick={() => setSitemap('')}>
							<Icon name="x" size={14}/>
							Clear
						</button>
					)}
					<button type="button" className={`${ui.button} ${ui.small}`} onClick={() => setSitemap(EXAMPLES[exampleIndex])}>
						<Icon name="file" size={14}/>
						Load example
					</button>
				</div>
			</div>
			<textarea
				ref={textAreaRef}
				id={textareaId}
				className={parsedSitemap.type === 'error' && !isEmpty ? classes.textareaError : classes.textarea}
				value={sitemap}
				onChange={e => setSitemap(e.currentTarget.value)}
				placeholder={EXAMPLES[exampleIndex]}
				spellCheck={false}
				autoCapitalize="off"
				autoComplete="off"
				aria-describedby={statusId}
				aria-invalid={parsedSitemap.type === 'error' && !isEmpty}
			/>
			<div id={statusId} className={classes.status} aria-live="polite">
				{isEmpty ? (
					<p className={classes.statusHint}>
						<Icon name="info" size={14}/>
						Paste the XML of your sitemap, or load the example.
					</p>
				) : parsedSitemap.type === 'error' ? (
					<p className={classes.statusError}>
						<Icon name="alert" size={14}/>
						{parsedSitemap.error}
					</p>
				) : (
					<details className={classes.urls}>
						<summary className={classes.statusSuccess}>
							<Icon name="check" size={14}/>
							{parsedSitemap.urls.length} URL{parsedSitemap.urls.length === 1 ? '' : 's'} loaded
							<span className={classes.showUrls}/>
						</summary>
						<ul className={classes.urlList}>
							{parsedSitemap.urls.map((url, i) => <li key={i}><code>{url}</code></li>)}
						</ul>
					</details>
				)}
			</div>
		</div>
	)
}
export default Sitemap
