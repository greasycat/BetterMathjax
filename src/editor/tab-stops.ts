import {Prec, type EditorState, type Extension} from "@codemirror/state";
import {keymap, type EditorView} from "@codemirror/view";
import {scanMath} from "../math/context";
import {findClosingBracket, findEnclosingClose, findNextPlaceholder, findPreviousClosingBracket, findPreviousPlaceholder} from "../snippet/placeholders";
import {exitAutoBrace} from "./auto-brace";
import {mathModeInState} from "./math-scan-cache";
import {fieldAtSelection, jumpField, type SessionView} from "./snippet-session";

/** The math region around `pos`, or its line when the region is not closed yet. */
function regionAround(state: EditorState, pos: number): {from: number; to: number} {
	const region = scanMath(state.doc.toString()).regions.find((region) => region.from <= pos && pos <= region.to);
	if (region) return region;
	const line = state.doc.lineAt(pos);
	return {from: line.from, to: line.to};
}

/**
 * Move to the next (`direction` 1) or previous (-1) stop. In order:
 * 1. Forward only: past a closing bracket that was added for the user, so they can finish the group first.
 *    That is a brace that auto-brace inserted, if it closes the innermost group, or the bracket that closes
 *    the innermost group inside the current snippet field, such as a `)` the editor paired.
 * 2. The next field of the active snippet.
 * 3. In math, the next `@n@` marker in the same math region.
 * 4. In math, past the next closing bracket on the line; backward, to just before the previous one.
 * Returns false when there is no stop, so the key keeps its normal behaviour.
 */
export function moveToStop(view: SessionView, direction: 1 | -1): boolean {
	const {state} = view;
	if (direction === 1) {
		const exit = exitAutoBrace(state);
		if (exit) {
			view.dispatch(exit);
			return true;
		}
		const field = fieldAtSelection(state);
		const head = state.selection.main.head;
		const close = field ? findEnclosingClose(state.doc.toString(), head, field.to) : null;
		if (close !== null) {
			view.dispatch({selection: {anchor: close}, scrollIntoView: true});
			return true;
		}
	}
	if (jumpField(view, direction)) return true;

	const {from, to} = state.selection.main;
	const start = direction === 1 ? to : from;
	if (mathModeInState(state, start) === null) return false;

	const text = state.doc.toString();
	const region = regionAround(state, start);
	const placeholder = direction === 1 ? findNextPlaceholder(text, start) : findPreviousPlaceholder(text, start);
	if (placeholder && placeholder.from >= region.from && placeholder.to <= region.to) {
		view.dispatch({selection: {anchor: placeholder.from, head: placeholder.to}, scrollIntoView: true});
		return true;
	}

	const bracket = direction === 1 ? findClosingBracket(text, start) : findPreviousClosingBracket(text, start);
	if (bracket === null || bracket < region.from || bracket > region.to) return false;
	view.dispatch({selection: {anchor: bracket}, scrollIntoView: true});
	return true;
}

/**
 * Tab and Shift+Tab move between stops (see `moveToStop`). With no stop, or when `enabled()` says no (for
 * example while the suggestion list is open and Tab should accept), the key keeps its normal behaviour. An
 * Obsidian hotkey on Tab could not do this: it blocks the key even when its command does nothing.
 */
export function tabStopKeymap(enabled: () => boolean): Extension {
	const run = (direction: 1 | -1) => (view: EditorView) => enabled() && moveToStop(view, direction);
	return Prec.highest(keymap.of([
		{key: "Tab", run: run(1)},
		{key: "Shift-Tab", run: run(-1)},
	]));
}
