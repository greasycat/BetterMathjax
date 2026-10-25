import {describe, expect, it} from "vitest";
import {DEFAULT_SETTINGS, legacySymbolNotePaths, migrateSettings} from "../src/settings/settings";

describe("migrateSettings", () => {
	it("returns defaults for empty data", () => {
		expect(migrateSettings(null)).toEqual(DEFAULT_SETTINGS);
	});

	it("maps 1.x keys", () => {
		expect(migrateSettings({
			forceEnabling: true,
			maxSuggestionNumber: 8,
			alwaysShowExamples: false,
			matchingSubScript: false,
			userDefineSymbolFilePath: "math/symbols.md",
			userDefinedSymbols: {},
			fuzzySearchType: "DLD",
			debugMode: true,
		})).toEqual({
			...DEFAULT_SETTINGS,
			activation: "always",
			maxSuggestions: 8,
			previewWithoutExample: false,
			autoBraceSubscript: false,
		});
	});

	it("maps the development-build jump key onto the Tab setting", () => {
		expect(migrateSettings({fieldJumpKey: "Tab"}).tabJumpsFields).toBe(true);
		expect(migrateSettings({fieldJumpKey: "Ctrl-j"}).tabJumpsFields).toBe(false);
		expect(migrateSettings({fieldJumpKey: ""}).tabJumpsFields).toBe(false);
		expect(migrateSettings({tabJumpsFields: false, fieldJumpKey: "Tab"}).tabJumpsFields).toBe(false);
	});

	it("prefers current keys and rejects invalid values", () => {
		expect(migrateSettings({maxSuggestions: 3, maxSuggestionNumber: 9, activation: "bogus", symbolFilePath: " "}))
			.toEqual({...DEFAULT_SETTINGS, maxSuggestions: 3});
		expect(migrateSettings({maxSuggestionNumber: NaN}).maxSuggestions).toBe(DEFAULT_SETTINGS.maxSuggestions);
	});
});

describe("custom symbols in settings", () => {
	it("keeps valid stored entries and drops invalid ones", () => {
		expect(migrateSettings({customSymbols: [{name: "\\R", snippet: "x"}, {snippet: "no name"}, 5]}).customSymbols)
			.toEqual([{name: "\\R", snippet: "x"}]);
		expect(migrateSettings({customSymbols: "bad"}).customSymbols).toEqual([]);
	});
});

describe("legacySymbolNotePaths", () => {
	it("is null once custom symbols are stored", () => {
		expect(legacySymbolNotePaths({customSymbols: []})).toBeNull();
	});

	it("lists the 1.x path, then the default note", () => {
		expect(legacySymbolNotePaths({userDefineSymbolFilePath: "math/symbols.md"})).toEqual(["math/symbols.md", "symbols.md"]);
		expect(legacySymbolNotePaths({userDefineSymbolFilePath: "symbols.md"})).toEqual(["symbols.md"]);
	});

	it("checks the default note for users who never saved settings", () => {
		expect(legacySymbolNotePaths(null)).toEqual(["symbols.md"]);
	});
});

describe("symbol storage settings", () => {
	it("defaults to hidden and validates the note path", () => {
		expect(migrateSettings({}).symbolStorage).toBe("hidden");
		expect(migrateSettings({symbolStorage: "note", symbolNotePath: "math/syms.md"})).toMatchObject({symbolStorage: "note", symbolNotePath: "math/syms.md"});
		expect(migrateSettings({symbolStorage: "elsewhere", symbolNotePath: "syms.txt"})).toMatchObject({symbolStorage: "hidden", symbolNotePath: DEFAULT_SETTINGS.symbolNotePath});
	});
});

describe("require backslash", () => {
	it("is off by default and takes over the earlier opposite switch", () => {
		expect(migrateSettings({}).requireBackslash).toBe(false);
		expect(migrateSettings({bareEnvironments: false}).requireBackslash).toBe(true);
		expect(migrateSettings({bareEnvironments: true}).requireBackslash).toBe(false);
		expect(migrateSettings({requireBackslash: true, bareEnvironments: true}).requireBackslash).toBe(true);
	});
});
