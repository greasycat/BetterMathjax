import {EditorSelection, EditorState, type TransactionSpec} from "@codemirror/state";
import {describe, expect, it} from "vitest";
import {activeFields, insertSnippet, jumpField, snippetSessionExtension, type SessionView} from "../src/editor/snippet-session";
import {orderFields} from "../src/snippet/placeholders";

/** A minimal stand-in for EditorView: enough state and dispatch for the session logic. */
function harness(doc: string, cursor = doc.length) {
	const view = {
		state: EditorState.create({doc, selection: {anchor: cursor}, extensions: snippetSessionExtension()}),
		dispatch(...specs: TransactionSpec[]) {
			this.state = this.state.update(...specs).state;
		},
	};
	const selected = () => view.state.sliceDoc(view.state.selection.main.from, view.state.selection.main.to);
	const type = (text: string) => view.dispatch(view.state.replaceSelection(text));
	return {view: view as unknown as SessionView & typeof view, selected, type};
}

describe("orderFields", () => {
	it("orders by placeholder number, then position", () => {
		const text = "@2@ @1@ @10@ @1@";
		expect(orderFields(text).map((span) => text.slice(span.from, span.to))).toEqual(["@1@", "@1@", "@2@", "@10@"]);
		expect(orderFields(text).map((span) => span.from)).toEqual([4, 13, 0, 8]);
	});
});

describe("snippet session", () => {
	it("keeps filled fields jumpable until the snippet is left", () => {
		const {view, selected, type} = harness("$");
		insertSnippet(view, 1, 1, "\\frac{@1@}{@2@}");
		expect(selected()).toBe("@1@");

		type("a+b");
		jumpField(view, 1);
		expect(selected()).toBe("@2@");
		type("c");

		// Back to the first field, now holding what was typed.
		jumpField(view, -1);
		expect(selected()).toBe("a+b");
		type("x");
		expect(view.state.doc.toString()).toBe("$\\frac{x}{c}");

		jumpField(view, 1);
		expect(selected()).toBe("c");
		// Every field is filled, so "next" on the last one leaves the snippet.
		jumpField(view, 1);
		expect(view.state.selection.main.head).toBe(view.state.doc.length);
		expect(activeFields(view.state)).toEqual([]);
		expect(jumpField(view, 1)).toBe(false);
	});

	it("wraps to an unfilled field instead of leaving", () => {
		const {view, selected, type} = harness("");
		insertSnippet(view, 0, 0, "\\int_{@1@}^{@2@}");
		jumpField(view, 1);
		type("1");
		jumpField(view, 1);
		expect(selected()).toBe("@1@");
	});

	it("ends when the cursor moves out of the snippet", () => {
		const {view} = harness("before ");
		insertSnippet(view, 7, 7, "\\sqrt{@1@}");
		expect(activeFields(view.state)).toHaveLength(1);
		view.dispatch({selection: EditorSelection.cursor(0)});
		expect(activeFields(view.state)).toEqual([]);
	});

	it("keeps fields mapped when text is inserted before the snippet", () => {
		const {view, selected} = harness("x");
		insertSnippet(view, 1, 1, "^{@1@}");
		view.dispatch({changes: {from: 0, insert: "abc"}});
		jumpField(view, -1);
		jumpField(view, 1);
		expect(selected()).toBe("@1@");
	});

	it("nests a snippet inside a field and returns to the outer one", () => {
		const {view, selected, type} = harness("");
		insertSnippet(view, 0, 0, "\\frac{@1@}{@2@}");
		const sel = view.state.selection.main;
		insertSnippet(view, sel.from, sel.to, "\\sqrt{@1@}");
		expect(selected()).toBe("@1@");
		type("2");
		// Inner snippet is done: leave it, then continue with the outer one.
		jumpField(view, 1);
		jumpField(view, 1);
		expect(selected()).toBe("@2@");
		expect(view.state.doc.toString()).toBe("\\frac{\\sqrt{2}}{@2@}");
	});

	it("does nothing to the selection when there is no session", () => {
		const {view} = harness("@1@ text", 0);
		expect(jumpField(view, 1)).toBe(false);
	});

	it("ends when a change replaces the whole note", () => {
		const {view} = harness("");
		insertSnippet(view, 0, 0, "\\frac{@1@}{@2@}");
		view.dispatch({changes: {from: 0, to: view.state.doc.length, insert: "new note text"}, selection: {anchor: 3}});
		expect(activeFields(view.state)).toEqual([]);
	});

	it("ends when a deletion covers part of a field", () => {
		const {view} = harness("");
		insertSnippet(view, 0, 0, "\\frac{@1@}{@2@}");
		view.dispatch({changes: {from: 4, to: 8}, selection: {anchor: 4}});
		expect(activeFields(view.state)).toEqual([]);
	});

	it("survives replacing exactly one field", () => {
		const {view, selected} = harness("");
		insertSnippet(view, 0, 0, "\\frac{@1@}{@2@}");
		view.dispatch(view.state.replaceSelection("abc"));
		jumpField(view, 1);
		expect(selected()).toBe("@2@");
	});
});

