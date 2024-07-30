export interface SitemapSuccess {
	readonly type: 'success'
	readonly urls: readonly string[];
	readonly error: null;
}
export interface SitemapError {
	readonly type: 'error'
	readonly urls: readonly [];
	readonly error: string;
}
export type Sitemap = SitemapSuccess | SitemapError;
export type Replacement = {
	readonly from: string;
	readonly to: string | null | undefined;
};
export interface OutputGeneratorImage {
	readonly src: string,
	readonly pos: {
		readonly x: number,
		readonly y: number,
		readonly width: number,
		readonly height: number,
	} | null
}
export interface OutputGenerator {
	readonly name: string,
	readonly image: OutputGeneratorImage | null,
	readonly generateOutput: (list: Replacement[]) => string
}