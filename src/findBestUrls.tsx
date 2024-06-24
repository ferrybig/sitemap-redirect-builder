import { Sitemap } from "./types";

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
function scoreParts(a: string, b: string): number {
	const aParts = new Set(a.split('/'));
	const bParts = new Set(b.split('/'));
	const total = aParts.size + bParts.size;
	let missing = 0;
	for (const part of aParts) {
		if (!bParts.has(part)) {
			missing++;
		}
	}
	for (const part of bParts) {
		if (!aParts.has(part)) {
			missing++;
		}
	}
	return missing / total;
}
function calculateScore(input: number) {
	return input / (input + 1);
}
function scoreEntries(a: string, b: string): number {
	const levenshteinScore = 1 - calculateScore(levenshtein(a, b) / 10);
	const scorePerPart = 1 - scoreParts(a, b);
	return scorePerPart * levenshteinScore;
}

export default function findBestUrls(sitemap: Sitemap, from: string): readonly (readonly [string, number])[] {
	const newUrls = sitemap.urls.map(url => [url, scoreEntries(from, url)] as const);
	newUrls.sort((a, b) => b[1] - a[1]);
	return newUrls;
}