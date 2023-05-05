import {Command, Notice, Plugin} from 'obsidian';
import MathjaxSuggest from './mathjax-suggest';
import {BetterMathjaxSettings} from "./settings";
import {MathjaxHelper} from "./mathjax-helper";
import Logger from './logger';

export function selectNextSuggestCommand(latexSuggest: MathjaxSuggest): Command {
	return {
		id: 'select-next-suggestion',
		name: 'Select next suggestion',
		hotkeys: [],
		repeatable: true, editorCallback: (_: never) => {
			latexSuggest.selectNextSuggestion();
		},
	};
}

export function selectPreviousSuggestCommand(latexSuggest: MathjaxSuggest): Command {
	return {
		id: 'select-previous-suggestion',
		name: 'Select previous suggestion',
		hotkeys: [],
		repeatable: true, editorCallback: (_: never) => {
			latexSuggest.selectPreviousSuggestion();
		},
	};
}

export function selectNextPlaceholderCommand(latexSuggest: MathjaxSuggest): Command {
	return {
		id: 'better-mathjax-select-next-placeholder',
		name: 'Select next placeholder',
		repeatable: true, editorCallback: (_: never) => {
			latexSuggest.selectNextPlaceholder();
		},
	};
}

export function selectPreviousPlaceholderCommand(latexSuggest: MathjaxSuggest): Command {
	return {
		id: 'better-mathjax-select-previous-placeholder',
		name: 'Select previous placeholder',
		repeatable: true, editorCallback: (_: never) => {
			latexSuggest.selectPreviousPlaceholder();
		},
	};
}

export function showMathjaxHelperOnCurrentSelection(latexSuggestions: MathjaxSuggest): Command {
	return {
		id: 'better-mathjax-show-mathjax-helper-on-current-selection',
		name: 'Show mathjax helper on current selection',
		repeatable: true, editorCallback: (_: never) => {
			latexSuggestions.showMathjaxHelperOnCurrentSelection();
		},
	};
}

export function insertSubscriptPlaceholder(mathjaxSuggest: MathjaxSuggest, settings: BetterMathjaxSettings): Command {
	return {
		id: 'better-mathjax-insert-subscript-placeholder-bracket',
		name: 'Insert subscript',
		repeatable: true, editorCallback: (editor, view) => {


			// Get current cursor position
			const cursor = editor.getCursor();
			if (settings.matchingSubScript && mathjaxSuggest.enabled)
			{
				editor.replaceRange("_{@1@}", cursor);
				mathjaxSuggest.selectNextPlaceholder();
			}
		},
	};
}

export function insertSuperscriptPlaceholder(mathjaxSuggest: MathjaxSuggest, settings: BetterMathjaxSettings): Command {
	return {
		id: 'better-mathjax-insert-superscript-placeholder-bracket',
		name: 'Insert superscript',
		repeatable: true, editorCallback: (editor, view) => {

			Logger.instance.info("Inserting superscript");
			// Get current cursor position
			const cursor = editor.getCursor();
			if (settings.matchingSuperScript && mathjaxSuggest.enabled) {
				editor.replaceRange("^{@1@}", cursor);
				mathjaxSuggest.selectNextPlaceholder();
			}
		},
	};
}

export function reloadUserDefinedFile(mathjaxHelper: MathjaxHelper): Command {
	return {
		id: 'better-mathjax-reload-user-defined-file',
		name: 'Reload user defined file',
		repeatable: true, editorCallback: (editor, view) => {
			mathjaxHelper.readUserDefinedSymbols().then(() => {
				new Notice("User defined file reloaded");
			});
		},
	};
}


export function addSubSuperScriptCommand(plugin: Plugin, mathjaxSuggest: MathjaxSuggest, settings: BetterMathjaxSettings) {
		plugin.addCommand(insertSubscriptPlaceholder(mathjaxSuggest, settings));
		plugin.addCommand(insertSuperscriptPlaceholder(mathjaxSuggest, settings));
}

export function removeSubSuperScriptCommand(plugin: Plugin) {
	// @ts-ignore
	plugin.app.commands.removeCommand("better-mathjax:better-mathjax-insert-superscript-placeholder-bracket");
	// @ts-ignore
	plugin.app.commands.removeCommand("better-mathjax:better-mathjax-insert-subscript-placeholder-bracket");
}
