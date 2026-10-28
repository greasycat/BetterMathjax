/** Placeholders are visible markers such as `@1@` inside a snippet; the number is only a label. */
export const PLACEHOLDER = /@\d+@/g;

export interface Span {
	from: number;
	to: number;
}

export function hasPlaceholder(text: string): boolean {
	PLACEHOLDER.lastIndex = 0;
	return PLACEHOLDER.test(text);
}

/** All placeholders in `text`, in jump order: by their number, then by position. */
export function orderFields(text: string): Span[] {
	const pattern = new RegExp(PLACEHOLDER.source, "g");
	const found: {span: Span; number: number}[] = [];
	let match: RegExpExecArray | null;
	while ((match = pattern.exec(text)) !== null) {
		found.push({span: {from: match.index, to: match.index + match[0].length}, number: Number(match[0].slice(1, -1))});
	}
	return found.sort((a, b) => a.number - b.number || a.span.from - b.span.from).map((item) => item.span);
}

/** First placeholder starting at or after `from`. */
export function findNextPlaceholder(text: string, from: number): Span | null {
	const pattern = new RegExp(PLACEHOLDER.source, "g");
	pattern.lastIndex = from;
	const match = pattern.exec(text);
	return match ? {from: match.index, to: match.index + match[0].length} : null;
}

/** Last placeholder that ends at or before `before`. */
export function findPreviousPlaceholder(text: string, before: number): Span | null {
	const pattern = new RegExp(PLACEHOLDER.source, "g");
	let found: Span | null = null;
	let match: RegExpExecArray | null;
	while ((match = pattern.exec(text)) !== null) {
		const end = match.index + match[0].length;
		if (end > before) break;
		found = {from: match.index, to: end};
	}
	return found;
}

const CLOSING = new Set(["}", ")", "]"]);
const isClosing = (text: string, i: number) => CLOSING.has(text[i]!) && text[i - 1] !== "\\";

/** Offset just past the next unescaped `}`, `)` or `]` on the same line as `from`, to step out of a group. */
export function findClosingBracket(text: string, from: number): number | null {
	for (let i = from; i < text.length && text[i] !== "\n"; i++) {
		if (isClosing(text, i)) return i + 1;
	}
	return null;
}

/**
 * Offset just past the bracket that closes the innermost group around `from`, if it comes before `to`.
 * Brackets opened after `from` are skipped together with their closing bracket.
 */
export function findEnclosingClose(text: string, from: number, to: number): number | null {
	let depth = 0;
	for (let i = from; i < to; i++) {
		const char = text[i];
		if (char === "\\") i++;
		else if (char === "{" || char === "(" || char === "[") depth++;
		else if (CLOSING.has(char!) && depth-- === 0) return i + 1;
	}
	return null;
}

/** Offset of the last unescaped `}`, `)` or `]` before `before` on its line, to step back into a group. */
export function findPreviousClosingBracket(text: string, before: number): number | null {
	for (let i = before - 1; i >= 0 && text[i] !== "\n"; i--) {
		if (isClosing(text, i)) return i;
	}
	return null;
}

/** Continue a multi-line snippet with the current line's leading indentation and blockquote/callout markers. */
export function indentSnippet(snippet: string, line: string): string {
	const prefix = line.match(/^(?:[ \t]*>)*[ \t]*/)?.[0] ?? "";
	if (prefix === "") return snippet;
	return snippet.replace(/\r?\n/g, "\n" + prefix);
}
