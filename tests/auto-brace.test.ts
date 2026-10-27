import {EditorState} from "@codemirror/state";
import {describe, expect, it} from "vitest";
import {autoBraceInput, closingBraceField} from "../src/editor/auto-brace";
import {mathScanField} from "../src/editor/math-scan-cache";
import {DEFAULT_SETTINGS} from "../src/settings/settings";

/** Types each character the way the input handler would, with the editor's default insert as the fallback. */
function typeText(doc: string, text: string, cursor = doc.length): EditorState {
	let state = EditorState.create({doc, selection: {anchor: cursor}, extensions: [closingBraceField, mathScanField]});
	for (const char of text) {
		const {from, to} = state.selection.main;
		state = state.update(autoBraceInput(state, DEFAULT_SETTINGS, from, to, char) ?? state.replaceSelection(char)).state;
	}
	return state;
}

const shown = (state: EditorState) => {
	const head = state.selection.main.head;
	return state.sliceDoc(0, head) + "|" + state.sliceDoc(head);
};

describe("auto-brace", () => {
	it("inserts braces for _ and ^ in math", () => {
		expect(shown(typeText("$", "x_"))).toBe("$x_{|}");
		expect(shown(typeText("", "x_"))).toBe("x_|");
	});

	it("moves over the closing brace it inserted", () => {
		expect(shown(typeText("$", "x_i}"))).toBe("$x_{i}|");
		expect(shown(typeText("$", "x^{2}}"))).toBe("$x^{{2}}|");
		expect(shown(typeText("$", "x_a^b}}"))).toBe("$x_{a^{b}}|");
		expect(shown(typeText("$", "e^x_i}}+"))).toBe("$e^{x_{i}}+|");
	});

	it("inserts } when the brace was not inserted by auto-brace", () => {
		expect(shown(typeText("$x{}", "}", 3))).toBe("$x{}|}");
	});

	it("forgets the brace when the cursor leaves the line", () => {
		let state = typeText("$$\n", "x_", 3);
		state = state.update({selection: {anchor: 0}}).state;
		state = state.update({selection: {anchor: 6}}).state;
		const {from, to} = state.selection.main;
		expect(autoBraceInput(state, DEFAULT_SETTINGS, from, to, "}")).toBeNull();
	});
});
