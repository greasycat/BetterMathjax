import {describe, expect, it} from "vitest";
import {parseJsonlNote, removeFromNote, serializeEntry, SYMBOL_NOTE_HEADER, upsertInNote} from "../src/symbols/jsonl-note";

const note = [
	"# My symbols",
	"",
	"Some notes I keep here.",
	"",
	"```jsonl",
	'{"name":"\\\\R","snippet":"\\\\mathbb{R}"}',
	'{ "name": "\\\\C",   "snippet": "\\\\mathbb{C}" }',
	"",
	"not json",
	'{"snippet":"no name"}',
	'{"name":"\\\\R","snippet":"dup"}',
	"```",
	"",
	"Footer.",
	"",
].join("\n");

describe("parseJsonlNote", () => {
	it("reads valid lines and reports the rest with note line numbers", () => {
		const result = parseJsonlNote(note);
		expect(result.hasBlock).toBe(true);
		expect(result.entries).toEqual([{name: "\\R", snippet: "\\mathbb{R}"}, {name: "\\C", snippet: "\\mathbb{C}"}]);
		expect(result.errors.map((error) => error.line)).toEqual([9, 10, 11]);
		expect(result.errors[1]!.message).toMatch(/name/);
		expect(result.errors[2]!.message).toMatch(/twice/);
	});

	it("handles a note without a block, an empty block, CRLF and an unclosed block", () => {
		expect(parseJsonlNote("just text")).toEqual({entries: [], errors: [], hasBlock: false});
		expect(parseJsonlNote("```jsonl\n```\n")).toEqual({entries: [], errors: [], hasBlock: true});
		expect(parseJsonlNote('```jsonl\r\n{"name":"\\\\a"}\r\n```\r\n').entries).toEqual([{name: "\\a"}]);
		expect(parseJsonlNote('```jsonl\n{"name":"\\\\a"}\n').errors[0]!.message).toMatch(/not closed/);
	});

	it("ignores json blocks and only reads jsonl", () => {
		expect(parseJsonlNote('```json\n[{"name":"\\\\a"}]\n```\n').hasBlock).toBe(false);
	});
});

describe("editing the note", () => {
	it("replaces only the changed line and keeps everything else verbatim", () => {
		const updated = upsertInNote(note, {name: "\\C", snippet: "\\mathbb{C}^{@1@}", description: ""});
		const before = note.split("\n");
		const after = updated.split("\n");
		expect(after).toHaveLength(before.length);
		expect(after.filter((line, i) => line !== before[i])).toEqual(['{"name":"\\\\C","snippet":"\\\\mathbb{C}^{@1@}"}']);
	});

	it("appends new entries after the last line of the block", () => {
		const updated = upsertInNote("```jsonl\n{\"name\":\"\\\\a\"}\n\n```\n", {name: "\\b"});
		expect(updated).toBe("```jsonl\n{\"name\":\"\\\\a\"}\n{\"name\":\"\\\\b\"}\n\n```\n");
	});

	it("renames in place and refuses to rename onto an existing name", () => {
		const updated = upsertInNote(note, {name: "\\Q", snippet: "\\mathbb{Q}"}, "\\R");
		expect(parseJsonlNote(updated).entries.map((entry) => entry.name)).toEqual(["\\Q", "\\C", "\\R"]);
		expect(() => upsertInNote(note, {name: "\\C"}, "\\R")).toThrow(/already exists/);
	});

	it("removes every line with that name and keeps invalid lines", () => {
		const updated = removeFromNote(note, "\\R");
		expect(updated).toContain("not json");
		expect(parseJsonlNote(updated).entries.map((entry) => entry.name)).toEqual(["\\C"]);
	});

	it("creates the header and block in an empty note, or appends a block to an existing one", () => {
		const created = upsertInNote("", {name: "\\R", snippet: "x"});
		expect(created.startsWith(SYMBOL_NOTE_HEADER)).toBe(true);
		expect(parseJsonlNote(created).entries).toEqual([{name: "\\R", snippet: "x"}]);
		expect(upsertInNote("My note", {name: "\\R"})).toBe("My note\n\n```jsonl\n{\"name\":\"\\\\R\"}\n```\n");
	});

	it("keeps CRLF line endings when adding a line", () => {
		const updated = upsertInNote("text\r\n```jsonl\r\n{\"name\":\"\\\\a\"}\r\n```\r\n", {name: "\\b"});
		expect(updated).toBe("text\r\n```jsonl\r\n{\"name\":\"\\\\a\"}\r\n{\"name\":\"\\\\b\"}\r\n```\r\n");
	});

	it("refuses to edit an unclosed block", () => {
		expect(() => upsertInNote("```jsonl\n{}", {name: "\\a"})).toThrow(/not closed/);
	});
});

describe("serializeEntry", () => {
	it("orders fields and drops empty ones", () => {
		expect(serializeEntry({see_also: ["\\C"], description: "reals", name: " \\R ", examples: [], snippet: "\\mathbb{R}"}))
			.toBe('{"name":"\\\\R","snippet":"\\\\mathbb{R}","description":"reals","see_also":["\\\\C"]}');
		expect(serializeEntry({name: "\\x", disabled: true})).toBe('{"name":"\\\\x","disabled":true}');
		expect(serializeEntry({name: "\\x", disabled: false})).toBe('{"name":"\\\\x"}');
	});
});
