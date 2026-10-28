import type {MacroDef} from "../math/macros";
import type {ResolvedSymbol} from "./types";

const SAMPLE_ARGS = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];

/** `{@1@}{@2@}…` for `count` required arguments. */
function fields(count: number): string {
	return Array.from({length: count}, (_, i) => `{@${i + 1}@}`).join("");
}

function sample(count: number, environment: boolean): string {
	// An environment's arguments are often column specs, where `c` is valid and letters such as `a` are not.
	return SAMPLE_ARGS.slice(0, count).map((arg) => `{${environment ? "c" : arg}}`).join("");
}

/**
 * Suggestions for the macros a note defines. `line(def)` gives the 1-based line of a definition, and
 * `lookup` finds the symbol that a `\let` copies. The note's definitions become the symbols' `preamble`,
 * so a preview renders even before MathJax has seen the note.
 */
export function documentSymbols(
	defs: readonly MacroDef[], line: (def: MacroDef) => number, lookup: (name: string) => ResolvedSymbol | undefined,
): ResolvedSymbol[] {
	const preamble = defs.map((def) => def.source).join("");
	// A later definition of the same name wins, as in TeX.
	const byName = new Map<string, MacroDef>();
	for (const def of defs) byName.set(def.name, def);

	return [...byName.values()].map((def) => {
		// The optional argument keeps its default, so the snippet asks only for the required ones.
		const required = def.args - (def.optional === null ? 0 : 1);
		let snippet: string;
		let example: string;
		if (def.kind === "environment") {
			snippet = `\\begin{${def.name}}${fields(required)}\n\t@${required + 1}@\n\\end{${def.name}}`;
			example = `\\begin{${def.name}}${sample(required, true)}x\\end{${def.name}}`;
		} else {
			snippet = required ? def.name + fields(required) : "";
			example = def.name + sample(required, false);
		}
		const copied = def.kind === "let" ? lookup(def.body) : undefined;
		return {
			name: def.name,
			key: def.kind === "environment" ? def.name : def.name.slice(1),
			description: [`Defined in this note on line ${line(def)}:`, "```tex\n" + def.source + "\n```", ...copied?.description ?? []],
			examples: [example],
			seeAlso: def.kind === "let" ? [def.body] : [],
			snippet: copied ? copied.snippet.replace(def.body, def.name) : snippet,
			preview: true,
			disabled: false,
			package: null,
			source: "document",
			preamble,
		};
	});
}

/** The note's symbols first, then every other symbol whose name the note does not define. */
export function withDocumentSymbols(note: readonly ResolvedSymbol[], others: readonly ResolvedSymbol[]): readonly ResolvedSymbol[] {
	if (note.length === 0) return others;
	const names = new Set(note.map((symbol) => symbol.name));
	return [...note, ...others.filter((symbol) => !names.has(symbol.name))];
}
