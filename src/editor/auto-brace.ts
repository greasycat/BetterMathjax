import {EditorState, RangeSet, RangeValue, StateEffect, StateField, type TransactionSpec} from "@codemirror/state";
import {EditorView} from "@codemirror/view";
import type {BetterMathjaxSettings} from "../settings/settings";
import {mathModeInState} from "./math-scan-cache";

class ClosingBrace extends RangeValue {}
const closingBrace = new ClosingBrace();

const addClosingBrace = StateEffect.define<number>({map: (pos, mapping) => mapping.mapPos(pos)});
const skipClosingBrace = StateEffect.define<number>({map: (pos, mapping) => mapping.mapPos(pos)});

/**
 * The positions of the `}` that auto-brace inserted and the user has not typed past yet.
 * Like CodeMirror's closeBrackets, the marks are dropped when the cursor leaves their line.
 */
export const closingBraceField = StateField.define<RangeSet<ClosingBrace>>({
	create: () => RangeSet.empty,
	update(braces, tr) {
		braces = braces.map(tr.changes);
		for (const effect of tr.effects) {
			if (effect.is(addClosingBrace)) braces = braces.update({add: [closingBrace.range(effect.value, effect.value + 1)]});
			if (effect.is(skipClosingBrace)) braces = braces.update({filter: (from) => from !== effect.value});
		}
		if (braces.size && tr.selection) {
			const line = tr.state.doc.lineAt(tr.selection.main.head);
			braces = braces.update({filter: (from) => from >= line.from && from < line.to});
		}
		return braces;
	},
});

function hasClosingBrace(state: EditorState, pos: number): boolean {
	let found = false;
	state.field(closingBraceField, false)?.between(pos, pos + 1, (from) => {
		if (from === pos) found = true;
	});
	return found && state.doc.sliceString(pos, pos + 1) === "}";
}

/**
 * Moving past the closing brace that auto-brace inserted, when it closes the innermost group around the cursor.
 * Tab does this before it moves to a field, so `x_{2}` can be finished inside a snippet field.
 */
export function exitAutoBrace(state: EditorState): TransactionSpec | null {
	const head = state.selection.main.head;
	const line = state.doc.lineAt(head);
	const rest = state.doc.sliceString(head, line.to);
	let depth = 0;
	for (let i = 0; i < rest.length; i++) {
		const char = rest[i];
		if (char === "\\") i++;
		else if (char === "{") depth++;
		else if (char === "}" && depth-- === 0) {
			const pos = head + i;
			if (!hasClosingBrace(state, pos)) return null;
			return {selection: {anchor: pos + 1}, effects: skipClosingBrace.of(pos), userEvent: "select"};
		}
	}
	return null;
}

/**
 * The transaction for typing `text` over `from`-`to`, or null to let the editor insert it.
 * Typing `_` or `^` inside math inserts `_{}` / `^{}` with the cursor between the braces.
 * With text selected, the selection is wrapped instead. `\_`, `\^` and an existing `{` are left alone.
 * Typing `}` just before a brace that was inserted this way moves over it.
 */
export function autoBraceInput(
	state: EditorState, settings: BetterMathjaxSettings, from: number, to: number, text: string,
): TransactionSpec | null {
	if (state.selection.ranges.length !== 1) return null;
	const {doc} = state;

	if (text === "}") {
		if (from !== to || !hasClosingBrace(state, from)) return null;
		return {selection: {anchor: from + 1}, effects: skipClosingBrace.of(from), userEvent: "input.type"};
	}

	if (text !== "_" && text !== "^") return null;
	if (text === "_" ? !settings.autoBraceSubscript : !settings.autoBraceSuperscript) return null;
	if (doc.sliceString(from - 1, from) === "\\" || doc.sliceString(to, to + 1) === "{") return null;
	if (!mathModeInState(state, from)) return null;

	const selected = doc.sliceString(from, to);
	const insert = `${text}{${selected}}`;
	const close = from + insert.length - 1;
	return {
		changes: {from, to, insert},
		selection: {anchor: selected === "" ? from + 2 : close + 1},
		effects: selected === "" ? addClosingBrace.of(close) : [],
		userEvent: "input.type",
	};
}

export function autoBraceExtension(getSettings: () => BetterMathjaxSettings) {
	return [
		closingBraceField,
		EditorView.inputHandler.of((view, from, to, text) => {
			if (view.composing) return false;
			const spec = autoBraceInput(view.state, getSettings(), from, to, text);
			if (!spec) return false;
			view.dispatch(spec);
			return true;
		}),
	];
}
