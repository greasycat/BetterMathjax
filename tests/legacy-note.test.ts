import {describe, expect, it} from "vitest";
import {parseLegacyNote, type YamlCodec} from "../src/symbols/legacy-note";

// JSON is valid YAML, which is enough to test the plumbing without Obsidian's parser.
const yaml: YamlCodec = {parse: (text: string) => JSON.parse(text)};

describe("parseLegacyNote", () => {
	it("reads the 1.x sample note", () => {
		const note = "```note\n- Use can use either json or yaml\n```\n\n```json\n[\n  {\n    \"name\": \"\\\\int\",\n    \"snippet\": \"\\\\int_{@1@}^{@2@}\",\n    \"description\": \"\",\n    \"examples\": \"\",\n    \"see_also\": []\n  }\n]\n```\n";
		expect(parseLegacyNote(note, yaml)).toEqual({ok: true, hasBlock: true, entries: [
			{name: "\\int", snippet: "\\int_{@1@}^{@2@}", description: "", examples: "", see_also: []},
		]});
	});

	it("uses the first json/yaml block and skips other code blocks", () => {
		const content = "```js\n[1]\n```\n```yaml\n[{\"name\": \"\\\\a\"}]\n```\n```json\n[{\"name\": \"\\\\b\"}]\n```\n";
		expect(parseLegacyNote(content, yaml)).toEqual({ok: true, hasBlock: true, entries: [{name: "\\a"}]});
	});

	it("handles CRLF line endings", () => {
		expect(parseLegacyNote("note\r\n```json\r\n[{\"name\": \"\\\\a\"}]\r\n```\r\n", yaml)).toMatchObject({ok: true, entries: [{name: "\\a"}]});
	});

	it("accepts the closing fence on the last content line (issue #5)", () => {
		expect(parseLegacyNote("```json\n[{\"name\": \"\\\\a\"}]```\n", yaml)).toMatchObject({ok: true, entries: [{name: "\\a"}]});
	});

	it("drops entries without a name", () => {
		const content = "```json\n[{\"snippet\": \"x\"}, {\"name\": \"\"}, 3, {\"name\": \"\\\\ok\"}]\n```";
		expect(parseLegacyNote(content, yaml)).toMatchObject({ok: true, entries: [{name: "\\ok"}]});
	});

	it("reports invalid content", () => {
		expect(parseLegacyNote("```json\n[{,]\n```", yaml).ok).toBe(false);
		expect(parseLegacyNote("```json\n{\"name\": \"x\"}\n```", yaml).ok).toBe(false);
	});

	it("treats a note without a block as empty", () => {
		expect(parseLegacyNote("just text", yaml)).toEqual({ok: true, entries: [], hasBlock: false});
	});
});
