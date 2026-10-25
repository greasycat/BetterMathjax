import {describe, expect, it} from "vitest";
import {cleanEntry, mergeEntries, removeEntry, setDisabledEntries, upsertEntry} from "../src/symbols/custom-symbols";
import type {SymbolEntry} from "../src/symbols/types";

const list: SymbolEntry[] = [{name: "\\a", snippet: "A"}, {name: "\\b", snippet: "B"}];

describe("custom symbol list", () => {
	it("cleans names and drops empty fields", () => {
		expect(cleanEntry({name: " \\R ", snippet: "x", description: "", examples: [], see_also: ["\\C"]}))
			.toEqual({name: "\\R", snippet: "x", see_also: ["\\C"]});
	});

	it("adds, replaces in place, and renames", () => {
		expect(upsertEntry(list, {name: "\\c"})).toEqual([...list, {name: "\\c"}]);
		expect(upsertEntry(list, {name: "\\a", snippet: "A2"})).toEqual([{name: "\\a", snippet: "A2"}, list[1]]);
		expect(upsertEntry(list, {name: "\\z", snippet: "Z"}, "\\a")).toEqual([{name: "\\z", snippet: "Z"}, list[1]]);
		expect(list).toEqual([{name: "\\a", snippet: "A"}, {name: "\\b", snippet: "B"}]);
	});

	it("refuses to rename onto an existing entry", () => {
		expect(() => upsertEntry(list, {name: "\\b"}, "\\a")).toThrow(/already exists/);
	});

	it("removes by name", () => {
		expect(removeEntry(list, "\\a")).toEqual([list[1]]);
		expect(removeEntry(list, "\\missing")).toEqual(list);
	});

	it("merges imports, replacing same-name entries and counting both", () => {
		const result = mergeEntries(list, [{name: "\\b", snippet: "B2", description: ""}, {name: "\\c"}]);
		expect(result).toEqual({list: [list[0], {name: "\\b", snippet: "B2"}, {name: "\\c"}], added: 1, replaced: 1});
	});
});

describe("disabling symbols", () => {
	it("adds a disabled entry for a built-in symbol and keeps other entries in place", () => {
		expect(setDisabledEntries(list, ["\\builtin"], true)).toEqual([...list, {name: "\\builtin", disabled: true}]);
	});

	it("flags an existing entry and keeps its fields", () => {
		expect(setDisabledEntries(list, ["\\a"], true)).toEqual([{name: "\\a", snippet: "A", disabled: true}, list[1]]);
	});

	it("enabling removes the flag, and an entry that is then only a name", () => {
		const disabled = setDisabledEntries(list, ["\\a", "\\builtin"], true);
		expect(setDisabledEntries(disabled, ["\\a", "\\builtin"], false)).toEqual(list);
	});

	it("does nothing for names that are already in the wanted state", () => {
		expect(setDisabledEntries(list, ["\\a"], false)).toEqual(list);
		expect(setDisabledEntries(list, ["\\nothing"], false)).toEqual(list);
	});
});
