import type {ResolvedSymbol} from "../symbols/types";

/**
 * Score how well `query` matches `key`. Higher is better; `null` means no match.
 * Tiers: exact > prefix > case-insensitive prefix > substring > subsequence.
 * Case matters (`\delta` and `\Delta` are different symbols), so exact-case matches rank first in each tier.
 */
export function score(query: string, key: string): number | null {
	if (query === "") return 0;
	if (key === query) return 1000;
	if (key.startsWith(query)) return 800 - (key.length - query.length);

	const lowerKey = key.toLowerCase();
	const lowerQuery = query.toLowerCase();
	if (lowerKey === lowerQuery) return 700;
	if (lowerKey.startsWith(lowerQuery)) return 600 - (key.length - query.length);

	const index = key.indexOf(query);
	if (index >= 0) return 400 - index;
	const lowerIndex = lowerKey.indexOf(lowerQuery);
	if (lowerIndex >= 0) return 350 - lowerIndex;

	// Subsequence: every query character appears in order. Penalize gaps between matched characters.
	let gaps = 0;
	let last = -1;
	for (const char of lowerQuery) {
		const next = lowerKey.indexOf(char, last + 1);
		if (next < 0) return null;
		if (last >= 0) gaps += next - last - 1;
		last = next;
	}
	// A subsequence that does not start at the first character is mostly noise; rank it last.
	const anchored = lowerKey[0] === lowerQuery[0] ? 0 : 100;
	return 200 - anchored - gaps - (key.length - query.length) / 10;
}

export function rank(symbols: readonly ResolvedSymbol[], query: string, limit: number): ResolvedSymbol[] {
	const scored: {symbol: ResolvedSymbol; score: number}[] = [];
	for (const symbol of symbols) {
		const value = score(query, symbol.key);
		if (value !== null) scored.push({symbol, score: value});
	}
	scored.sort((a, b) =>
		b.score - a.score ||
		a.symbol.key.length - b.symbol.key.length ||
		(a.symbol.key < b.symbol.key ? -1 : a.symbol.key > b.symbol.key ? 1 : 0));
	return scored.slice(0, limit).map((item) => item.symbol);
}
