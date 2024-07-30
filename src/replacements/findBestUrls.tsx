import { Sitemap } from '../types';

function levenshtein(a: string, b: string): number {
	const dp = Array.from({ length: a.length + 1 }, () => Array.from({ length: b.length + 1 }, () => 0));
	for (let i = 0; i <= a.length; i++) {
		for (let j = 0; j <= b.length; j++) {
			if (i === 0) {
				dp[i][j] = j;
			} else if (j === 0) {
				dp[i][j] = i;
			} else if (a[i - 1] === b[j - 1]) {
				dp[i][j] = dp[i - 1][j - 1];
			} else {
				dp[i][j] = 1 + Math.min(dp[i][j - 1], dp[i - 1][j], dp[i - 1][j - 1]);
			}
		}
	}
	return dp[a.length][b.length];
}
function scoreParts(a: string, b: string, cache: Record<string, Set<string>>): number {
	const aParts = cache[a]
	const bParts = cache[b]
	const total = Math.max(aParts.size, bParts.size);
	let removals = 0;
	let toAdd = 0;
	for (const part of aParts) {
		if (!bParts.has(part)) {
			removals++;
		}
	}
	for (const part of bParts) {
		if (!aParts.has(part)) {
			toAdd++;
		}
	}
	return Math.max(toAdd, removals) / total;
}
function calculateScore(input: number) {
	return input / (input + 1);
}
function scoreEntries(a: string, b: string, cache: Record<string, Set<string>>): number {
	const levenshteinScore = 1 - calculateScore(levenshtein(a, b) / 10);
	const scorePerPart = 1 - scoreParts(a, b, cache);
	return scorePerPart * levenshteinScore;
}

export function buildCache(oldUrls: readonly string[], newUrls: readonly string[]): Record<string, Set<string>> {
	const cache: Record<string, Set<string>> = {};
	for(const url of oldUrls) {
		cache[url] = new Set(url.split(/[_/-]/).map(e => e.toLowerCase()));
	}
	for(const url of newUrls) {
		cache[url] = new Set(url.split(/[_/-]/).map(e => e.toLowerCase()));
	}
	return cache;

}

export default function findBestUrls(oldUrls: Sitemap['urls'], newUrl: string, cache: Record<string, Set<string>> = {}): readonly (readonly [string, number])[] {
	const newUrls = oldUrls.map(url => [url, scoreEntries(newUrl, url, cache)] as const);
	newUrls.sort((a, b) => b[1] - a[1]);
	return newUrls.slice(0, 3);
}