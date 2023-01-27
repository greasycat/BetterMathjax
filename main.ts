import {loadMathJax, Notice, Plugin, TAbstractFile} from 'obsidian';

import MathjaxSuggest from './src/mathjax-suggest';
import {
	selectNextSuggestCommand,
	selectPreviousSuggestCommand,
	selectNextPlaceholderCommand,
	selectPreviousPlaceholderCommand,
	showMathjaxHelperOnCurrentSelection,
	reloadUserDefinedFile,
} from './src/commands';
import {BetterMathjaxSettings, BetterMathjaxSettingTab, DEFAULT_SETTINGS} from "./src/settings";
import {MathjaxHelper} from "./src/mathjax-helper";
import Logger from "./src/logger";


// Remember to rename these classes and interfaces!


export default class BetterMathjaxPlugin extends Plugin {
	settings: BetterMathjaxSettings;
	mathjaxHelper: MathjaxHelper;
	mathjaxSuggest: MathjaxSuggest;

	async onload() {
		await this.loadSettings();
		Logger.instance.setConsoleLogEnabled(this.settings.debugMode);
		this.addSettingTab(new BetterMathjaxSettingTab(this.app, this));
		// Load mathjax
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

		this.app.vault.on("modify", this.userDefinedFileChanged, this);
	}

	onunload() {
		this.app.vault.off("modify", this.userDefinedFileChanged);
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
					Logger.instance.info("User defined file successful reloaded");
				} else {
					new Notice("User defined file reload failed, check your format!!", 6000);
					Logger.instance.error("User defined file reload failed");
				}
			});
		}
	}
}





