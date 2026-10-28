import {EditorState, type TransactionSpec} from "@codemirror/state";
import {describe, expect, it} from "vitest";
import {autoBraceInput, closingBraceField} from "../src/editor/auto-brace";
import {mathScanField} from "../src/editor/math-scan-cache";
import {insertSnippet, snippetSessionExtension, type SessionView} from "../src/editor/snippet-session";
import {moveToStop} from "../src/editor/tab-stops";
import {DEFAULT_SETTINGS} from "../src/settings/settings";

/** A stand-in for EditorView. `|` in `doc` marks the cursor. */
function harness(doc: string) {
	const cursor = doc.indexOf("|");
	const fake = {
		state: EditorState.create({
			doc: doc.replace("|", ""), selection: {anchor: cursor},
			extensions: [snippetSessionExtension(), closingBraceField, mathScanField],
		}),
		dispatch(...specs: TransactionSpec[]) {
			this.state = this.state.update(...specs).state;
		},
	};
	const view = fake as unknown as SessionView & typeof fake;
	const type = (text: string) => {
		for (const char of text) {
			const {from, to} = view.state.selection.main;
			view.dispatch(autoBraceInput(view.state, DEFAULT_SETTINGS, from, to, char) ?? view.state.replaceSelection(char));
		}
	};
	const tab = (direction: 1 | -1 = 1) => moveToStop(view, direction);
	/** The document with the selection shown as `|` (cursor) or `[…]` (selected text). */
	const shown = () => {
		const {from, to} = view.state.selection.main;
		const text = view.state.doc.toString();
		return from === to ? text.slice(0, from) + "|" + text.slice(from) : text.slice(0, from) + "[" + text.slice(from, to) + "]" + text.slice(to);
	};
	return {view, type, tab, shown};
}

describe("tab stops", () => {
	it("moves between snippet fields first", () => {
		const {view, tab, shown} = harness("$|$");
		insertSnippet(view, 1, 1, "\\frac{@1@}{@2@}");
		expect(shown()).toBe("$\\frac{[@1@]}{@2@}$");
		tab();
		expect(shown()).toBe("$\\frac{@1@}{[@2@]}$");
		tab(-1);
		expect(shown()).toBe("$\\frac{[@1@]}{@2@}$");
	});

	it("leaves an auto-inserted brace before it goes to the next field", () => {
		const {view, type, tab, shown} = harness("$|$");
		insertSnippet(view, 1, 1, "\\frac{@1@}{@2@}");
		type("x_2");
		expect(shown()).toBe("$\\frac{x_{2|}}{@2@}$");
		tab();
		expect(shown()).toBe("$\\frac{x_{2}|}{@2@}$");
		tab();
		expect(shown()).toBe("$\\frac{x_{2}}{[@2@]}$");
	});

	it("leaves a bracket inside the current field before it goes to the next field", () => {
		const {view, tab, shown} = harness("$|$");
		insertSnippet(view, 1, 1, "\\frac{@1@}{@2@}");
		view.dispatch(view.state.replaceSelection("(a+b)"));
		view.dispatch({selection: {anchor: 11}});
		expect(shown()).toBe("$\\frac{(a+b|)}{@2@}$");
		tab();
		expect(shown()).toBe("$\\frac{(a+b)|}{@2@}$");
		tab();
		expect(shown()).toBe("$\\frac{(a+b)}{[@2@]}$");
	});

	it("keeps the field first when the auto-inserted brace is not the innermost group", () => {
		const {view, type, tab, shown} = harness("$|$");
		type("x_");
		insertSnippet(view, 4, 4, "\\frac{@1@}{@2@}");
		expect(shown()).toBe("$x_{\\frac{[@1@]}{@2@}}$");
		tab();
		expect(shown()).toBe("$x_{\\frac{@1@}{[@2@]}}$");
	});

	it("moves past the next closing bracket in math, and back before the previous one", () => {
		const {tab, shown} = harness("$f(x| + [a, b]) = \\sqrt{y}$");
		tab();
		expect(shown()).toBe("$f(x + [a, b]|) = \\sqrt{y}$");
		tab();
		expect(shown()).toBe("$f(x + [a, b])| = \\sqrt{y}$");
		tab();
		expect(shown()).toBe("$f(x + [a, b]) = \\sqrt{y}|$");
		expect(tab()).toBe(false);
		tab(-1);
		expect(shown()).toBe("$f(x + [a, b]) = \\sqrt{y|}$");
		tab(-1);
		expect(shown()).toBe("$f(x + [a, b]|) = \\sqrt{y}$");
	});

	it("selects a leftover marker in the same math region before a bracket", () => {
		const {tab, shown} = harness("$|x) + @1@$ and $@2@$");
		tab();
		expect(shown()).toBe("$x) + [@1@]$ and $@2@$");
		expect(tab()).toBe(false);
	});

	it("does nothing outside math, so Tab keeps its normal use", () => {
		const {tab} = harness("- item| (a) @1@");
		expect(tab()).toBe(false);
		expect(tab(-1)).toBe(false);
	});
});
