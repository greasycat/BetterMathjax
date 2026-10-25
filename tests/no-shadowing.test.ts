import {readFileSync} from "node:fs";
import {describe, expect, it} from "vitest";

// Members Obsidian's PopoverSuggest/EditorSuggest use internally (seen in Obsidian 1.14). A field with one of
// these names in a subclass replaces Obsidian's own and breaks the suggester: a field called `isOpen` once
// crashed the plugin on load, and one called `trigger` stopped every suggestion.
const RESERVED = [
	"isOpen", "win", "app", "scope", "suggestEl", "suggestInnerEl", "suggestions", "instructionsEl", "context",
	"limit", "suggestManager", "trigger", "showSuggestions", "updatePosition", "setInstructions", "open", "close",
];

describe("EditorSuggest subclass", () => {
	it("declares no field with a name Obsidian uses internally", () => {
		const source = readFileSync(new URL("../src/editor/math-suggest.ts", import.meta.url), "utf8");
		const fields = [...source.matchAll(/^\t(?:private |protected |public |readonly |static )*(\w+)[!?]?\s*[:=]/gm)].map((match) => match[1]);
		expect(fields.length).toBeGreaterThan(3);
		expect(fields.filter((name) => RESERVED.includes(name!))).toEqual([]);
	});
});
