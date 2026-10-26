import {scanMath, type MathRegion} from "../math/context";
import {formatMath} from "./tex-format";

/** Replace `from`…`to` (offsets in the note) with `insert`. */
export interface TextChange {
	from: number;
	to: number;
	insert: string;
}

/** Blockquote / callout markers and indentation at the start of a line, e.g. "> " or "    ". */
const PREFIX = /^(?:[ \t]*>)*[ \t]*/;

export function mathRegions(text: string): MathRegion[] {
	return scanMath(text).regions;
}

/** The math region that contains `offset`, delimiters included. */
export function regionAt(text: string, offset: number): MathRegion | null {
	return mathRegions(text).find((region) => region.start <= offset && offset <= region.end) ?? null;
}

/**
 * The change that formats one region, or null if it is already formatted or cannot be formatted safely.
 * Display math is laid out over lines, keeping the blockquote or list prefix of its first line. Inline math
 * only has its spaces tidied; it never gets new lines.
 */
export function formatRegion(text: string, region: MathRegion, unit: string): TextChange | null {
	const content = text.slice(region.from, region.to);
	if (region.mode === "inline") {
		const formatted = formatMath(content, unit);
		return formatted === content || formatted.includes("\n") ? null : {from: region.from, to: region.to, insert: formatted};
	}

	// Lines after the first carry the prefix of the line that opens the block ("> " in a callout).
	const lineStart = text.lastIndexOf("\n", region.start - 1) + 1;
	const prefix = PREFIX.exec(text.slice(lineStart, region.start))![0];
	const lines = content.split("\n");
	const stripped: string[] = [lines[0]!];
	for (const line of lines.slice(1)) {
		if (line.startsWith(prefix)) stripped.push(line.slice(prefix.length));
		else if (line.trim() === prefix.trim()) stripped.push("");
		else return null; // the block's lines do not share the prefix: leave it as it is
	}
	const tex = stripped.join("\n").trim();
	const formatted = formatMath(tex, unit);
	const multiline = formatted.includes("\n") || content.includes("\n");
	const insert = multiline
		? `\n${formatted.split("\n").map((line) => prefix + line).join("\n")}\n${prefix}`
		: formatted;
	return insert === content ? null : {from: region.from, to: region.to, insert};
}

/** Changes that format every math region in the note, in document order. */
export function formatAllMath(text: string, unit: string): TextChange[] {
	return mathRegions(text)
		.map((region) => formatRegion(text, region, unit))
		.filter((change): change is TextChange => change !== null);
}

/** Apply changes to a string (used by tests; the plugin applies them through the editor). */
export function applyChanges(text: string, changes: readonly TextChange[]): string {
	return [...changes].sort((a, b) => b.from - a.from).reduce((out, change) => out.slice(0, change.from) + change.insert + out.slice(change.to), text);
}
