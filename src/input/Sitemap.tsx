import { useEffect, useId, useRef } from 'react'
import {Sitemap as SitemapType } from '../types'
import classes from './Sitemap.module.css'
import LinkButton from '../components/LinkButton'
import useRunAfterInitialRender from '../hooks/useRunAfterInitialRender';

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
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	/**
	 * This provides support for F5 in the build version of the app, where the browser auto fills the input with the old data from before the refresh
	 */
	useRunAfterInitialRender(() => {
		if (textAreaRef.current && textAreaRef.current.value !== textAreaRef.current.defaultValue) {
			setSitemap(textAreaRef.current.value);
		}
	})
	return (
		<>
			<p className={classes.title}>
				<label htmlFor={textareaId}>{label}</label>
			</p>
			<p className={classes.subTitle}>
				<LinkButton onClick={() => setSitemap(EXAMPLES[exampleIndex])}>Load example</LinkButton>
			</p>
			<textarea ref={textAreaRef} id={textareaId} className={classes.textarea} value={sitemap} onChange={e => setSitemap(e.currentTarget.value)} placeholder={EXAMPLES[exampleIndex]}/>
			<p className={parsedSitemap.type === 'error' ? classes.error : classes.info} title={parsedSitemap.type === 'success' ? parsedSitemap.urls.join('\n') : undefined}>
				{parsedSitemap.error ?? parsedSitemap.urls.length + ' url\'s loaded'}
			</p>
		</>
	)
}
export default Sitemap