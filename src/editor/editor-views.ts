import type {Extension} from "@codemirror/state";
import {EditorView, ViewPlugin} from "@codemirror/view";
import {editorInfoField, type Editor} from "obsidian";

/** Maps Obsidian's `Editor` to its CodeMirror view, using only public API, so commands can reach editor state. */
const views = new WeakMap<Editor, EditorView>();

export function editorViewRegistry(): Extension {
	return ViewPlugin.define((view) => {
		const editor = view.state.field(editorInfoField, false)?.editor;
		if (editor) views.set(editor, view);
		return {};
	});
}

export function viewForEditor(editor: Editor): EditorView | null {
	return views.get(editor) ?? null;
}
