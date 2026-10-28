import {Notice} from "obsidian";
import {formatAllMathInNote, formatMathAtCursor} from "./editor/format-commands";
import {commandAtCursor, selectNextPlaceholder, selectPreviousPlaceholder} from "./editor/insert";
import {moveSelection} from "./editor/suggest-internals";
import type BetterMathjaxPlugin from "./main";

// Obsidian prefixes these with the plugin ID ("better-mathjax:"), so they must not contain it themselves.
export const COMMAND_IDS = {
	nextSuggestion: "select-next-suggestion",
	previousSuggestion: "select-previous-suggestion",
	acceptSuggestion: "accept-suggestion",
	nextPlaceholder: "select-next-placeholder",
	previousPlaceholder: "select-previous-placeholder",
	showReference: "show-symbol-reference",
	importSymbolNote: "import-symbol-note",
	openSymbolNote: "open-symbol-note",
	restoreSymbols: "restore-symbols",
	formatMathAtCursor: "format-math-at-cursor",
	formatAllMath: "format-all-math",
	addSymbol: "add-custom-symbol",
	browseSymbols: "browse-custom-symbols",
	browseAllSymbols: "browse-all-symbols",
} as const;

export function registerCommands(plugin: BetterMathjaxPlugin): void {
	const {suggest} = plugin;

	plugin.addCommand({
		id: COMMAND_IDS.nextSuggestion,
		name: "Select next suggestion",
		repeatable: true,
		editorCheckCallback: (checking) => {
			if (!suggest.isShowing()) return false;
			if (!checking) moveSelection(suggest, 1);
			return true;
		},
	});

	plugin.addCommand({
		id: COMMAND_IDS.previousSuggestion,
		name: "Select previous suggestion",
		repeatable: true,
		editorCheckCallback: (checking) => {
			if (!suggest.isShowing()) return false;
			if (!checking) moveSelection(suggest, -1);
			return true;
		},
	});

	plugin.addCommand({
		id: COMMAND_IDS.acceptSuggestion,
		name: "Accept suggestion",
		editorCheckCallback: (checking) => {
			if (!suggest.isShowing()) return false;
			if (!checking) suggest.acceptSelected();
			return true;
		},
	});

	plugin.addCommand({
		id: COMMAND_IDS.nextPlaceholder,
		name: "Select next placeholder",
		repeatable: true,
		editorCallback: (editor) => selectNextPlaceholder(editor),
	});

	plugin.addCommand({
		id: COMMAND_IDS.previousPlaceholder,
		name: "Select previous placeholder",
		repeatable: true,
		editorCallback: (editor) => selectPreviousPlaceholder(editor),
	});

	plugin.addCommand({
		id: COMMAND_IDS.showReference,
		name: "Show symbol reference",
		editorCallback: (editor) => {
			const name = suggest.selectedSymbol()?.name ?? commandAtCursor(editor);
			const symbol = name === null ? undefined
				: plugin.noteSymbols(editor).find((note) => note.name === name) ?? plugin.registry.get(name);
			if (symbol) plugin.showSymbol(symbol);
			else new Notice(name === null ? "No symbol at the cursor" : `Unknown symbol ${name}`);
		},
	});

	plugin.addCommand({
		id: COMMAND_IDS.addSymbol,
		name: "Add custom symbol",
		callback: () => {
			// Start from the command under the cursor if there is one, e.g. to customize \frac.
			const editor = plugin.app.workspace.activeEditor?.editor;
			plugin.editSymbol((editor && commandAtCursor(editor)) ?? "");
		},
	});

	plugin.addCommand({
		id: COMMAND_IDS.browseAllSymbols,
		name: "Browse all symbols",
		callback: () => plugin.browseAllSymbols(),
	});

	plugin.addCommand({
		id: COMMAND_IDS.browseSymbols,
		name: "Browse custom symbols",
		callback: () => plugin.browseSymbols(),
	});

	plugin.addCommand({
		id: COMMAND_IDS.openSymbolNote,
		name: "Open symbol note",
		checkCallback: (checking) => {
			if (plugin.customSymbols.storage !== "note") return false;
			if (!checking) void plugin.openSymbolNote();
			return true;
		},
	});

	plugin.addCommand({
		id: COMMAND_IDS.formatMathAtCursor,
		name: "Format math at cursor",
		editorCallback: (editor) => formatMathAtCursor(editor, plugin.mathIndentUnit()),
	});

	plugin.addCommand({
		id: COMMAND_IDS.formatAllMath,
		name: "Format all math in note",
		editorCallback: (editor) => formatAllMathInNote(editor, plugin.mathIndentUnit()),
	});

	plugin.addCommand({
		id: COMMAND_IDS.restoreSymbols,
		name: "Restore custom symbols from backup",
		callback: () => plugin.restoreSymbols(),
	});

	plugin.addCommand({
		id: COMMAND_IDS.importSymbolNote,
		name: "Import custom symbols from note",
		callback: () => plugin.importSymbolNote(),
	});
}
