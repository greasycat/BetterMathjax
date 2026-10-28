import type {Editor, EditorPosition} from "obsidian";
import {findClosingBracket, findNextPlaceholder, findPreviousPlaceholder, indentSnippet, orderFields} from "../snippet/placeholders";
import {viewForEditor} from "./editor-views";
import {mathOpenInState} from "./math-scan-cache";
import {mathLinePrefix} from "./no-indent";
import {insertSnippet} from "./snippet-session";
import {moveToStop} from "./tab-stops";
import {insertionText} from "../snippet/insertion";
import type {ResolvedSymbol} from "../symbols/types";

/**
 * Replace `from…to` with the symbol and select its first placeholder, or put the cursor after it. Snippets start
 * a session that keeps their fields jumpable after they are filled in. Returns the cursor.
 * Without `indentMath`, snippet lines lose their indentation and keep only the prefix of the line that opens
 * the math.
 */
export function insertSymbol(
	editor: Editor, symbol: ResolvedSymbol, from: EditorPosition, to: EditorPosition, useSnippetFirst: boolean, indentMath = true,
): EditorPosition {
	const insertion = insertionText(symbol, useSnippetFirst);
	const view = viewForEditor(editor);
	let text = insertion.text;
	if (insertion.isSnippet) {
		const open = !indentMath && view ? mathOpenInState(view.state, editor.posToOffset(from)) : null;
		text = open === null || !view
			? indentSnippet(text, editor.getLine(from.line))
			: indentSnippet(text.replace(/\n[ \t]+/g, "\n"), mathLinePrefix(view.state, open));
	}
	if (view && insertion.isSnippet) {
		return editor.offsetToPos(insertSnippet(view, editor.posToOffset(from), editor.posToOffset(to), text));
	}

	// Without a CodeMirror view (should not happen in Obsidian's editor) fall back to plain markers.
	editor.replaceRange(text, from, to);
	const start = editor.posToOffset(from);
	const placeholder = insertion.isSnippet ? orderFields(text)[0] ?? null : null;
	if (placeholder) {
		editor.setSelection(editor.offsetToPos(start + placeholder.from), editor.offsetToPos(start + placeholder.to));
	} else {
		editor.setCursor(editor.offsetToPos(start + text.length));
	}
	return editor.getCursor("to");
}

/**
 * Move to the next stop, as Tab does (see `moveToStop`). Outside math, select the next `@n@` marker in the
 * note, or with none left step past the next closing bracket on the line.
 */
export function selectNextPlaceholder(editor: Editor): void {
	const view = viewForEditor(editor);
	if (view && moveToStop(view, 1)) return;
	const text = editor.getValue();
	const from = editor.posToOffset(editor.getCursor("to"));
	const placeholder = findNextPlaceholder(text, from);
	if (placeholder) {
		editor.setSelection(editor.offsetToPos(placeholder.from), editor.offsetToPos(placeholder.to));
		return;
	}
	const bracket = findClosingBracket(text, from);
	if (bracket !== null) editor.setCursor(editor.offsetToPos(bracket));
}

export function selectPreviousPlaceholder(editor: Editor): void {
	const view = viewForEditor(editor);
	if (view && moveToStop(view, -1)) return;
	const text = editor.getValue();
	const placeholder = findPreviousPlaceholder(text, editor.posToOffset(editor.getCursor("from")));
	if (placeholder) editor.setSelection(editor.offsetToPos(placeholder.from), editor.offsetToPos(placeholder.to));
}

/** The `\command` under or just before the cursor, if any. */
export function commandAtCursor(editor: Editor): string | null {
	const cursor = editor.getCursor();
	const line = editor.getLine(cursor.line);
	const pattern = /\\[A-Za-z]+/g;
	let match: RegExpExecArray | null;
	while ((match = pattern.exec(line)) !== null) {
		if (match.index <= cursor.ch && cursor.ch <= match.index + match[0].length) return match[0];
	}
	return null;
}
