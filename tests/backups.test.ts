import {describe, expect, it} from "vitest";
import {backupFileName, backupsToPrune, diffEntries, isRedundant, MAX_BACKUPS, overwrites, parseBackup, type Backup} from "../src/symbols/backups";

const backup = (over: Partial<Backup> = {}): Backup => ({
	version: 1, createdAt: "2026-10-25T10:00:00.000Z", reason: "Before saving \\R", kind: "change",
	storage: "hidden", entries: [{name: "\\R", snippet: "x"}], ...over,
});

describe("backups", () => {
	it("names files so they sort by time", () => {
		const a = backupFileName(new Date("2026-10-25T09:59:59.999Z"));
		const b = backupFileName(new Date("2026-10-25T10:00:00.000Z"));
		expect(a).toBe("2026-10-25T09-59-59-999Z.json");
		expect([b, a].sort()).toEqual([a, b]);
	});

	it("skips a backup identical to the latest one", () => {
		expect(isRedundant(null, backup())).toBe(false);
		expect(isRedundant(backup(), backup({createdAt: "2026-10-25T11:00:00.000Z"}))).toBe(true);
		expect(isRedundant(backup(), backup({entries: [{name: "\\R", snippet: "y"}]}))).toBe(false);
		// Empty fields do not count as a difference.
		expect(isRedundant(backup(), backup({entries: [{name: "\\R", snippet: "x", description: ""}]}))).toBe(true);
		expect(isRedundant(backup({noteContent: "a"}), backup({noteContent: "b"}))).toBe(false);
	});

	it("coalesces outside edits within two minutes, but not other changes", () => {
		const first = backup({kind: "outside-edit", createdAt: "2026-10-25T10:00:00.000Z"});
		const soon = backup({kind: "outside-edit", createdAt: "2026-10-25T10:01:00.000Z", entries: []});
		const later = backup({kind: "outside-edit", createdAt: "2026-10-25T10:03:00.000Z", entries: []});
		expect(isRedundant(first, soon)).toBe(true);
		expect(isRedundant(first, later)).toBe(false);
		expect(isRedundant(first, backup({createdAt: "2026-10-25T10:00:30.000Z", entries: []}))).toBe(false);
	});

	it("prunes the oldest beyond the limit", () => {
		const names = ["2026-01-03.json", "2026-01-01.json", "2026-01-02.json", "2026-01-04.json"];
		expect(backupsToPrune(names, 2)).toEqual(["2026-01-02.json", "2026-01-01.json"]);
		expect(backupsToPrune(names, 10)).toEqual([]);
	});

	it("describes what a restore would change", () => {
		const current = [{name: "\\a", snippet: "1"}, {name: "\\b", snippet: "2"}];
		const old = [{name: "\\a", snippet: "1", description: ""}, {name: "\\b", snippet: "old"}, {name: "\\c"}];
		expect(diffEntries(current, old)).toEqual({added: ["\\c"], removed: [], changed: ["\\b"]});
		expect(diffEntries(current, [])).toEqual({added: [], removed: ["\\a", "\\b"], changed: []});
	});

	it("reads back a backup and rejects anything else", () => {
		expect(parseBackup(JSON.stringify(backup({storage: "note", notePath: "n.md", noteContent: "text"}))))
			.toEqual(backup({storage: "note", notePath: "n.md", noteContent: "text"}));
		expect(parseBackup("{}")).toBeNull();
		expect(parseBackup("not json")).toBeNull();
		expect(parseBackup(JSON.stringify({...backup(), entries: [{name: "\\ok"}, {nope: 1}]}))!.entries).toEqual([{name: "\\ok"}]);
	});

	it("only counts changes and removals of existing entries as overwriting", () => {
		const before = [{name: "\\a", snippet: "1"}, {name: "\\b"}];
		expect(overwrites(before, [...before, {name: "\\c"}])).toBe(false);
		expect(overwrites(before, [{name: "\\b"}, {name: "\\a", snippet: "1", description: ""}])).toBe(false);
		expect(overwrites(before, [{name: "\\a", snippet: "2"}, {name: "\\b"}])).toBe(true);
		expect(overwrites(before, [{name: "\\a", snippet: "1"}])).toBe(true);
		expect(overwrites([], [{name: "\\a"}])).toBe(false);
	});

	it("keeps at most ten backups", () => {
		expect(MAX_BACKUPS).toBe(10);
		const names = Array.from({length: 12}, (_, i) => `2026-01-${String(i + 1).padStart(2, "0")}.json`);
		expect(backupsToPrune(names)).toEqual(["2026-01-02.json", "2026-01-01.json"]);
	});
});
