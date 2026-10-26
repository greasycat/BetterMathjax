import {sanitizeEntries} from "./registry";
import type {SymbolEntry} from "./types";

/**
 * Reader for the symbol notes used before 2.0: a Markdown note whose first ```json or ```yaml code block
 * holds an array of symbol entries. Custom symbols now live in the plugin data; this is only for importing.
 */

export interface YamlCodec {
	parse(text: string): unknown;
}

interface Block {
	lang: "json" | "yaml";
	body: string;
}

export type LegacyParseResult =
	| {ok: true; entries: SymbolEntry[]; hasBlock: boolean}
	| {ok: false; error: string};

// The closing fence may share a line with the last of the content (`]```), which people wrote by accident (issue #5).
const BLOCK = /^```[ \t]*(json|ya?ml)[ \t]*\r?\n([\s\S]*?)```[ \t]*$/m;

function findBlock(content: string): Block | null {
	const match = BLOCK.exec(content);
	if (!match) return null;
	return {lang: match[1] === "json" ? "json" : "yaml", body: match[2]!};
}

function parseBody(block: Block, yaml: YamlCodec): unknown {
	if (block.body.trim() === "") return [];
	return block.lang === "json" ? JSON.parse(block.body) : yaml.parse(block.body);
}

export function parseLegacyNote(content: string, yaml: YamlCodec): LegacyParseResult {
	const block = findBlock(content);
	if (!block) return {ok: true, entries: [], hasBlock: false};
	let raw: unknown;
	try {
		raw = parseBody(block, yaml);
	} catch (error) {
		return {ok: false, error: `Invalid ${block.lang.toUpperCase()}: ${error instanceof Error ? error.message : String(error)}`};
	}
	if (raw === null || raw === undefined) return {ok: true, entries: [], hasBlock: true};
	if (!Array.isArray(raw)) return {ok: false, error: `The ${block.lang.toUpperCase()} block must contain a list of symbols.`};
	return {ok: true, entries: sanitizeEntries(raw), hasBlock: true};
}
