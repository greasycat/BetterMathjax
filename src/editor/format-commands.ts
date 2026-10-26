import {App, Editor, Notice} from "obsidian";
import {formatAllMath, formatRegion, regionAt, type TextChange} from "../format/format-note";

/**
 * One level of indentation as the editor uses it. Obsidian does not expose its editor settings in the
 * public API, so read them defensively and fall back to a tab.
 */
export function indentUnit(app: App): string {
	const vault = app.vault as unknown as {getConfig?: (key: string) => unknown};
	const useTab = vault.getConfig?.("useTab");
	const size = vault.getConfig?.("tabSize");
	if (useTab === false) return " ".repeat(typeof size === "number" && size > 0 ? size : 4);
	return "\t";
}

/** Apply all changes as one edit, so a single undo reverts them. */
function apply(editor: Editor, changes: readonly TextChange[]): void {
	editor.transaction({
		changes: changes.map((change) => ({from: editor.offsetToPos(change.from), to: editor.offsetToPos(change.to), text: change.insert})),
	});
}

export function formatMathAtCursor(app: App, editor: Editor): void {
	const text = editor.getValue();
	const region = regionAt(text, editor.posToOffset(editor.getCursor()));
	if (!region) {
		new Notice("The cursor is not in math.");
		return;
	}
	const change = formatRegion(text, region, indentUnit(app));
	if (!change) {
		new Notice("This math is already formatted.");
		return;
	}
	apply(editor, [change]);
}

export function formatAllMathInNote(app: App, editor: Editor): void {
	const changes = formatAllMath(editor.getValue(), indentUnit(app));
	if (changes.length === 0) {
		new Notice("All math in this note is already formatted.");
		return;
	}
	apply(editor, changes);
	new Notice(`Formatted ${changes.length} math ${changes.length === 1 ? "block" : "blocks"}.`);
}
