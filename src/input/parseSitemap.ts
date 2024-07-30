//import { XMLParser, XMLValidator } from "fast-xml-parser";
import { Sitemap } from '../types';
const base = new URL('http://localhost');
const EMPTY_URLS: [] = [];

// This file feels like a mess
export default function parseSitemap(sitemap: string): Sitemap {
	if (sitemap === '') {
		return { type: 'error', error: 'Please provide your sitemap', urls: EMPTY_URLS };
	}
	try {
		/*const isValid = XMLValidator.validate(sitemap);
		if (isValid !== true) {
			return { type: 'error', error: "Sitemap is not valid XML: " + isValid.err.msg + " ("+isValid.err.line + ":" + isValid.err.col + ")", urls: EMPTY_URLS };
		}
		const parser = new XMLParser();
		const xmlDoc = parser.parse(sitemap, {
			unpairedTags: [],
			allowBooleanAttributes: true,

		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const rawUrls = Array.from(xmlDoc.urlset.url).map((e: any) => e.loc).filter((url): url is string => url !== undefined);
		*/
		const parser = new DOMParser();
		const parsed = parser.parseFromString(sitemap, 'application/xml');

		const rawUrls = [...parsed.querySelectorAll('loc')].map(e => e.innerHTML)
		const urls = rawUrls.map(url => {
			const urlObject = new URL(url, base);
			urlObject.hostname = base.hostname;
			urlObject.port = base.port;
			urlObject.protocol = base.protocol;
			urlObject.password = base.password;
			urlObject.username = base.username;
			return '/' + urlObject.href.replace(base.href, '');
		});
		if (urls.length === 0) {
			return { type: 'error', error: 'Cannot parse sitemap, no <loc> tags found', urls: EMPTY_URLS };
		}

		return { type: 'success', error: null, urls: urls.length === 0 ? EMPTY_URLS : urls };
	} catch(e) {
		return { type: 'error', error: e instanceof Error ? e.message : `${e}`, urls: EMPTY_URLS };
	}

}