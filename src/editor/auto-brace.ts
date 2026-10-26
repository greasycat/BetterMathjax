import {EditorView} from "@codemirror/view";
import type {BetterMathjaxSettings} from "../settings/settings";
import {mathModeInState} from "./math-scan-cache";

/**
 * Typing `_` or `^` inside math inserts `_{}` / `^{}` with the cursor between the braces.
 * With text selected, the selection is wrapped instead. `\_`, `\^` and an existing `{` are left alone.
 */
export function autoBraceExtension(getSettings: () => BetterMathjaxSettings) {
	return EditorView.inputHandler.of((view, from, to, text) => {
		if (text !== "_" && text !== "^") return false;
		const settings = getSettings();
		if (text === "_" ? !settings.autoBraceSubscript : !settings.autoBraceSuperscript) return false;
		if (view.state.selection.ranges.length !== 1 || view.composing) return false;

		const {doc} = view.state;
		if (doc.sliceString(from - 1, from) === "\\" || doc.sliceString(to, to + 1) === "{") return false;
		if (!mathModeInState(view.state, from)) return false;

		const selected = doc.sliceString(from, to);
		const insert = `${text}{${selected}}`;
		const cursor = selected === "" ? from + 2 : from + insert.length;
		view.dispatch({changes: {from, to, insert}, selection: {anchor: cursor}, userEvent: "input.type"});
		return true;
	});
}
