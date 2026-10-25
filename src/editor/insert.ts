import type {Editor, EditorPosition} from "obsidian";
import {findClosingBrace, findNextPlaceholder, findPreviousPlaceholder, indentSnippet, orderFields} from "../snippet/placeholders";
import {viewForEditor} from "./editor-views";
import {insertSnippet, jumpField} from "./snippet-session";
import {insertionText} from "../snippet/insertion";
import type {ResolvedSymbol} from "../symbols/types";

/**
 * Replace `from…to` with the symbol and select its first placeholder, or put the cursor after it. Snippets start
 * a session that keeps their fields jumpable after they are filled in. Returns the cursor.
 */
export function insertSymbol(editor: Editor, symbol: ResolvedSymbol, from: EditorPosition, to: EditorPosition, useSnippetFirst: boolean): EditorPosition {
	const insertion = insertionText(symbol, useSnippetFirst);
	const text = insertion.isSnippet ? indentSnippet(insertion.text, editor.getLine(from.line)) : insertion.text;
	const view = viewForEditor(editor);
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
 * Select the next field of the active snippet. Outside a snippet, select the next `@n@` marker in the note,
 * or with none left step past the next `}` on the line.
 */
export function selectNextPlaceholder(editor: Editor): void {
	const view = viewForEditor(editor);
	if (view && jumpField(view, 1)) return;
	const text = editor.getValue();
	const from = editor.posToOffset(editor.getCursor("to"));
	const placeholder = findNextPlaceholder(text, from);
	if (placeholder) {
		editor.setSelection(editor.offsetToPos(placeholder.from), editor.offsetToPos(placeholder.to));
		return;
	}
	const brace = findClosingBrace(text, from);
	if (brace !== null) editor.setCursor(editor.offsetToPos(brace));
}

export function selectPreviousPlaceholder(editor: Editor): void {
	const view = viewForEditor(editor);
	if (view && jumpField(view, -1)) return;
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
