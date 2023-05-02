import {loadMathJax, Plugin} from 'obsidian';

import MathjaxSuggest from './mathjax-suggest';
import {
	selectNextSuggestCommand,
	selectPreviousSuggestCommand,
	selectNextPlaceholderCommand,
	selectPreviousPlaceholderCommand,
	showMathjaxHelperOnCurrentSelection,
	reloadUserDefinedFile,
} from './commands';
import {BetterMathjaxSettings, BetterMathjaxSettingTab, DEFAULT_SETTINGS, userDefinedFileChanged} from "./settings";
import {MathjaxHelper} from "./mathjax-helper";
import Logger from "./logger";

export default class BetterMathjaxPlugin extends Plugin {
	settings: BetterMathjaxSettings;
	mathjaxHelper: MathjaxHelper;
	mathjaxSuggest: MathjaxSuggest;

	async onload() {
		await this.loadSettings();
		Logger.instance.setConsoleLogEnabled(this.settings.debugMode);
		this.addSettingTab(new BetterMathjaxSettingTab(this.app, this));

		// Actively load mathjax
		await loadMathJax();

		this.mathjaxHelper = new MathjaxHelper(this.app, this.settings);
		this.mathjaxSuggest = new MathjaxSuggest(this, this.settings, this.mathjaxHelper);
		this.registerEditorSuggest(this.mathjaxSuggest);

		this.addCommand(selectNextSuggestCommand(this.mathjaxSuggest));
		this.addCommand(selectPreviousSuggestCommand(this.mathjaxSuggest));
		this.addCommand(selectNextPlaceholderCommand(this.mathjaxSuggest));
		this.addCommand(selectPreviousPlaceholderCommand(this.mathjaxSuggest));
		this.addCommand(showMathjaxHelperOnCurrentSelection(this.mathjaxSuggest));
		this.addCommand(reloadUserDefinedFile(this.mathjaxHelper));

		this.registerEvent(this.app.vault.on("modify", userDefinedFileChanged, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}





