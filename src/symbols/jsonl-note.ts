import {cleanEntry} from "./custom-symbols";
import type {SymbolEntry} from "./types";

/**
 * The visible symbol note: a Markdown note whose first ```jsonl code block holds one symbol per line.
 * Line-based so that people and agents can add, change or delete a symbol by editing one line, and so the
 * plugin can rewrite only the lines it changes. Everything outside the block, and every line the plugin does
 * not change (even an invalid one), is kept as written.
 */

export interface LineError {
	/** 1-based line number in the note. */
	line: number;
	message: string;
}

export interface JsonlParseResult {
	entries: SymbolEntry[];
	errors: LineError[];
	hasBlock: boolean;
}

interface Block {
	/** Offsets of the body, between the opening fence line and the closing fence. */
	bodyFrom: number;
	bodyTo: number;
	/** 1-based note line number of the first body line. */
	firstLine: number;
	eol: string;
}

const OPEN = /^```[ \t]*jsonl[ \t]*\r?$/m;
const CLOSE = /^```[ \t]*\r?$/m;

function findBlock(content: string): Block | {error: LineError} | null {
	const open = OPEN.exec(content);
	if (!open) return null;
	const bodyFrom = open.index + open[0].length + 1;
	const firstLine = content.slice(0, bodyFrom).split("\n").length;
	const rest = content.slice(Math.min(bodyFrom, content.length));
	const close = CLOSE.exec(rest);
	if (!close) return {error: {line: firstLine - 1, message: "The jsonl block is not closed with ```."}};
	return {bodyFrom, bodyTo: bodyFrom + close.index, firstLine, eol: content.includes("\r\n") ? "\r\n" : "\n"};
}

/** Body lines without their line endings; a trailing newline does not produce an extra empty line. */
function bodyLines(content: string, block: Block): string[] {
	const body = content.slice(block.bodyFrom, block.bodyTo).replace(/\r?\n$/, "");
	return body === "" ? [] : body.split(/\r?\n/);
}

/** The entry on one line, or why the line is not one. Blank lines are neither. */
function parseLine(text: string): {entry: SymbolEntry} | {error: string} | null {
	if (text.trim() === "") return null;
	let value: unknown;
	try {
		value = JSON.parse(text);
	} catch (error) {
		return {error: `Not valid JSON (${error instanceof Error ? error.message : String(error)}).`};
	}
	if (typeof value !== "object" || value === null || Array.isArray(value)) return {error: "Each line must be one JSON object."};
	const entry = value as SymbolEntry;
	if (typeof entry.name !== "string" || entry.name.trim() === "") return {error: "Missing \"name\"."};
	return {entry};
}

export function parseJsonlNote(content: string): JsonlParseResult {
	const block = findBlock(content);
	if (!block) return {entries: [], errors: [], hasBlock: false};
	if ("error" in block) return {entries: [], errors: [block.error], hasBlock: true};

	const entries: SymbolEntry[] = [];
	const errors: LineError[] = [];
	const seen = new Set<string>();
	bodyLines(content, block).forEach((text, index) => {
		const line = block.firstLine + index;
		const parsed = parseLine(text);
		if (parsed === null) return;
		if ("error" in parsed) {
			errors.push({line, message: parsed.error});
		} else if (seen.has(parsed.entry.name)) {
			errors.push({line, message: `${parsed.entry.name} is defined twice; this line is ignored.`});
		} else {
			seen.add(parsed.entry.name);
			entries.push(parsed.entry);
		}
	});
	return {entries, errors, hasBlock: true};
}

/** One line of JSON with the fields in a fixed, readable order and empty fields left out. */
export function serializeEntry(entry: SymbolEntry): string {
	const clean = cleanEntry(entry);
	const ordered: Record<string, unknown> = {name: clean.name};
	for (const field of ["disabled", "snippet", "description", "examples", "see_also"] as const) {
		if (clean[field] !== undefined) ordered[field] = clean[field];
	}
	return JSON.stringify(ordered);
}

export const SYMBOL_NOTE_HEADER = `# Better MathJax Symbols

Custom symbols for the Better MathJax plugin. Edit them here, or with the "Browse custom symbols" command.

- The \`jsonl\` block below has one symbol per line, as a JSON object. Only \`name\` is required.
- Fields: \`name\` (e.g. \`"\\\\R"\`), \`snippet\` (inserted text; mark jump points with \`@1@\`, \`@2@\`, …), \`description\` (Markdown), \`examples\` (list of TeX strings), \`see_also\` (list of names).
- A line whose name matches a built-in symbol overrides only the fields it has.
- \`"disabled": true\` leaves a symbol out of the suggestions, for example \`{"name":"\\\\textcent","disabled":true}\`.
- Changes apply as soon as the note is saved. Lines that are not valid are reported and skipped.
- The plugin only rewrites the lines it changes; the rest of this note is left as you wrote it.
`;

/**
 * Rewrite the block's lines with `edit` and return the new note. `edit` gets each line's text and parsed name
 * (null for blank or invalid lines) and returns the new line texts. Adds a block, or a whole note, if missing.
 */
function editLines(content: string, edit: (lines: {text: string; name: string | null}[]) => string[]): string {
	let block = findBlock(content);
	if (block && "error" in block) throw new Error(block.error.message);
	if (!block) {
		const base = content.trim() === "" ? SYMBOL_NOTE_HEADER : content;
		const separator = base.endsWith("\n\n") ? "" : base.endsWith("\n") ? "\n" : "\n\n";
		content = `${base}${separator}\`\`\`jsonl\n\`\`\`\n`;
		block = findBlock(content) as Block;
	}
	const lines = bodyLines(content, block).map((text) => {
		const parsed = parseLine(text);
		return {text, name: parsed && "entry" in parsed ? parsed.entry.name : null};
	});
	const next = edit(lines);
	const body = next.length === 0 ? "" : next.join(block.eol) + block.eol;
	return content.slice(0, block.bodyFrom) + body + content.slice(block.bodyTo);
}

/**
 * Add `entry`, or replace the line of the entry called `previousName` (default: `entry.name`) in place.
 * Throws when renaming onto another existing entry.
 */
export function upsertInNote(content: string, entry: SymbolEntry, previousName: string = entry.name): string {
	const name = entry.name.trim();
	return editLines(content, (lines) => {
		if (previousName !== name && lines.some((line) => line.name === name)) {
			throw new Error(`A custom symbol named ${name} already exists.`);
		}
		const index = lines.findIndex((line) => line.name === previousName);
		const text = serializeEntry(entry);
		if (index < 0) {
			// Append after the last non-blank line so trailing blank lines stay at the end.
			let at = lines.length;
			while (at > 0 && lines[at - 1]!.text.trim() === "") at--;
			return [...lines.slice(0, at).map((line) => line.text), text, ...lines.slice(at).map((line) => line.text)];
		}
		return lines.map((line, i) => (i === index ? text : line.text));
	});
}

export function removeFromNote(content: string, name: string): string {
	return editLines(content, (lines) => lines.filter((line) => line.name !== name).map((line) => line.text));
}

/** Replace every line of the block with `entries`. Used when restoring a backup into a note. */
export function replaceAllInNote(content: string, entries: readonly SymbolEntry[]): string {
	return editLines(content, () => entries.map(serializeEntry));
}
