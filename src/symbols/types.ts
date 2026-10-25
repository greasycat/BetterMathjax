/** A symbol entry as written in the built-in table or the custom symbols. Every field but `name` is optional. */
export interface SymbolEntry {
	name: string;
	description?: string | string[];
	examples?: string | string[];
	see_also?: string[];
	snippet?: string;
	/** false: never render a preview, e.g. for commands that define macros. */
	preview?: boolean;
	/** true: leave the symbol out of suggestions. Set by the user, on their own or a built-in symbol. */
	disabled?: boolean;
	/** The MathJax TeX package that provides a built-in symbol. */
	package?: string;
}

/** A symbol after user overrides have been merged onto the built-in entry. */
export interface ResolvedSymbol {
	name: string;
	/** What the trigger query is matched against: `name` without its leading backslash. */
	key: string;
	description: string[];
	examples: string[];
	seeAlso: string[];
	snippet: string;
	/** Whether the suggestion list may render a preview for this symbol. */
	preview: boolean;
	/** The user turned the symbol off; it is not suggested. */
	disabled: boolean;
	package: string | null;
	source: "builtin" | "user" | "override";
}
