export interface SitemapSuccess {
	type: 'success'
	urls: string[];
	error: null;
}
export interface SitemapError {
	type: 'error'
	urls: [];
	error: string;
}
export type Sitemap = SitemapSuccess | SitemapError;
export type Replacement = {
	from: string;
	to: string | null;
};
