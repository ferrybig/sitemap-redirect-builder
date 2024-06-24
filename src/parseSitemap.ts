import { XMLParser, XMLValidator } from "fast-xml-parser";
import { Sitemap } from "./types";
const base = new URL("http://localhost");

// This file feels like a mess
export default function parseSitemap(sitemap: string): Sitemap {
	if (sitemap === "") {
		return { type: 'error', error: "Sitemap is empty", urls: [] };
	}
	try {
		const isValid = XMLValidator.validate(sitemap);
		if (isValid !== true) {
			return { type: 'error', error: "Sitemap is not valid XML: " + isValid.err.msg + " ("+isValid.err.line + ":" + isValid.err.col + ")", urls: [] };
		}
		const parser = new XMLParser();
		const xmlDoc = parser.parse(sitemap, {
			unpairedTags: [],
			allowBooleanAttributes: true,
		});
		console.log(xmlDoc);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const rawUrls = Array.from(xmlDoc.urlset.url).map((e: any) => e.loc).filter((url): url is string => url !== undefined);
		const urls = rawUrls.map(url => {
			const urlObject = new URL(url, base);
			urlObject.hostname = base.hostname;
			urlObject.port = base.port;
			urlObject.protocol = base.protocol;
			return '/' + urlObject.href.replace(base.href, '');
		});

		return { type: 'success', error: null, urls };
	} catch(e) {
		return { type: 'error', error: e instanceof Error ? e.message : `${e}`, urls: [] };
	}

}