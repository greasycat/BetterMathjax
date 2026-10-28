import {Prec, type EditorState, type Extension} from "@codemirror/state";
import {keymap, type EditorView} from "@codemirror/view";
import {continuationPrefix} from "../format/format-note";
import {mathOpenInState} from "./math-scan-cache";

/**
 * The text that starts a new line in the math that opens at `open`: the blockquote, callout or list prefix of
 * the line where the math opens, and no indentation of its own.
 */
export function mathLinePrefix(state: EditorState, open: number): string {
	const line = state.doc.lineAt(open);
	return continuationPrefix(state.doc.sliceString(line.from, open));
}

/** Enter in math: a new line with only the prefix that keeps the math in its blockquote or list. */
export function newlineWithoutIndent(view: Pick<EditorView, "state" | "dispatch">): boolean {
	const {state} = view;
	const {from, to} = state.selection.main;
	const open = mathOpenInState(state, from);
	if (open === null) return false;
	const insert = "\n" + mathLinePrefix(state, open);
	view.dispatch({changes: {from, to, insert}, selection: {anchor: from + insert.length}, scrollIntoView: true, userEvent: "input"});
	return true;
}

/**
 * When `enabled()`, math gets no indentation: Tab and Shift+Tab do nothing in math (after the tab stops had
 * their turn), and Enter does not copy the indentation of the line above. Outside math, the keys work as usual.
 */
export function noIndentKeymap(enabled: () => boolean): Extension {
	const inMath = (view: EditorView) => mathOpenInState(view.state, view.state.selection.main.from) !== null;
	return Prec.highest(keymap.of([
		{key: "Tab", run: (view) => enabled() && inMath(view)},
		{key: "Shift-Tab", run: (view) => enabled() && inMath(view)},
		{key: "Enter", run: (view) => enabled() && newlineWithoutIndent(view)},
	]));
}
