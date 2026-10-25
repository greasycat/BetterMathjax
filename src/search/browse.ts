import type {ResolvedSymbol} from "../symbols/types";
import {rank} from "./ranker";

export type SourceFilter = "all" | "builtin" | "customized" | "custom" | "disabled";

export interface BrowseFilter {
	query: string;
	source: SourceFilter;
	/** Only symbols from this MathJax package, or null for all. */
	pkg: string | null;
}

function matchesSource(symbol: ResolvedSymbol, source: SourceFilter): boolean {
	switch (source) {
		case "builtin": return symbol.source === "builtin";
		case "customized": return symbol.source === "override";
		case "custom": return symbol.source === "user";
		case "disabled": return symbol.disabled;
		default: return true;
	}
}

/**
 * Symbols for the browser. Without a query: sorted by name, letter commands first. With one: name matches first, in ranked order,
 * then symbols whose description mentions the query (so "arrow" finds \to and \mapsto).
 */
export function browseSymbols(symbols: readonly ResolvedSymbol[], filter: BrowseFilter): ResolvedSymbol[] {
	const pool = symbols.filter((symbol) => matchesSource(symbol, filter.source) && (filter.pkg === null || symbol.package === filter.pkg));
	const query = filter.query.trim().replace(/^\\/, "");
	// Letter commands first; punctuation such as \, or ( ) after them.
	const group = (symbol: ResolvedSymbol) => (/^[A-Za-z]/.test(symbol.key) ? 0 : 1);
	if (query === "") return [...pool].sort((a, b) => group(a) - group(b) || a.key.localeCompare(b.key) || a.name.localeCompare(b.name));
	const byName = rank(pool, query, pool.length);
	const seen = new Set(byName);
	const lower = query.toLowerCase();
	const byDescription = pool.filter((symbol) => !seen.has(symbol) && symbol.description.some((text) => text.toLowerCase().includes(lower)));
	return [...byName, ...byDescription];
}
