import {loadMathJax, Notice, Plugin, TAbstractFile} from 'obsidian';

import MathjaxSuggest from './src/mathjax-suggest';
import {
	selectNextSuggestCommand,
	selectPreviousSuggestCommand,
	selectNextPlaceholderCommand,
	selectPreviousPlaceholderCommand,
	showMathjaxHelperOnCurrentSelection,
	insertSubscriptPlaceholder,
	insertSuperscriptPlaceholder,
	reloadUserDefinedFile,
} from './src/commands';
import {BetterMathjaxSettings, BetterMathjaxSettingTab, DEFAULT_SETTINGS} from "./src/settings";
import {MathjaxHelper} from "./src/mathjax-helper";


// Remember to rename these classes and interfaces!


export default class MyPlugin extends Plugin {
	settings: BetterMathjaxSettings;
	mathjaxHelper: MathjaxHelper;
	mathjaxSuggest: MathjaxSuggest;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new BetterMathjaxSettingTab(this.app, this));
		// Load mathjax
		await loadMathJax();
		this.mathjaxHelper = new MathjaxHelper(this.app, this.settings);
		this.mathjaxSuggest = new MathjaxSuggest(this.app, this.settings, this.mathjaxHelper);
		this.registerEditorSuggest(this.mathjaxSuggest);


		this.addCommand(selectNextSuggestCommand(this.mathjaxSuggest));
		this.addCommand(selectPreviousSuggestCommand(this.mathjaxSuggest));
		this.addCommand(selectNextPlaceholderCommand(this.mathjaxSuggest));
		this.addCommand(selectPreviousPlaceholderCommand(this.mathjaxSuggest));
		this.addCommand(showMathjaxHelperOnCurrentSelection(this.mathjaxSuggest));
		this.addCommand(insertSubscriptPlaceholder(this.mathjaxSuggest, this.settings));
		this.addCommand(insertSuperscriptPlaceholder(this.mathjaxSuggest, this.settings));
		this.addCommand(reloadUserDefinedFile(this.mathjaxHelper));


		this.app.vault.on("modify", this.userDefinedFileChanged.bind(this));

	}

	onunload() {
		this.app.vault.off("modify", this.userDefinedFileChanged.bind(this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	userDefinedFileChanged(file: TAbstractFile) {
		if (file.path === this.settings.userDefineSymbolFilePath) {
			this.mathjaxHelper.readUserDefinedSymbols().then((status) => {
				if (status) {
					new Notice("User defined file successful reloaded", 3000);
				} else {
					new Notice("User defined file reload failed", 3000);
				}
			});
		}
	}
}





