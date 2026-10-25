import type {ResolvedSymbol} from "../symbols/types";

/** Text to insert for a symbol. Environments (names without a backslash) are only usable through their snippet. */
export function insertionText(symbol: ResolvedSymbol, useSnippetFirst: boolean): {text: string; isSnippet: boolean} {
	const isCommand = symbol.name.startsWith("\\");
	if (symbol.snippet !== "" && (useSnippetFirst || !isCommand)) return {text: symbol.snippet, isSnippet: true};
	if (!isCommand) return {text: `\\begin{${symbol.name}}\n@1@\n\\end{${symbol.name}}`, isSnippet: true};
	return {text: symbol.name, isSnippet: false};
}
