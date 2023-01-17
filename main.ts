import {loadMathJax, Plugin} from 'obsidian';

import MathjaxSuggest from './src/mathjax-suggest';
import {
	SelectNextSuggestCommand,
	SelectPreviousSuggestCommand,
	SelectNextPlaceholderCommand,
	SelectPreviousPlaceholderCommand,
	ShowMathjaxHelperOnCurrentSelection,
} from './src/commands';
import {BetterMathjaxSettings, BetterMathjaxSettingTab, DEFAULT_SETTINGS} from "./src/settings";
import {MathjaxHelper} from "./src/mathjax-helper";
import {subscriptHandler} from "./src/mathjax-pairing";


// Remember to rename these classes and interfaces!



export default class MyPlugin extends Plugin {
	settings: BetterMathjaxSettings;
	mathjaxHelper: MathjaxHelper;
    mathjaxSuggest: MathjaxSuggest;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new BetterMathjaxSettingTab(this.app, this));

		// Load mathjax
		await loadMathJax();
		this.mathjaxHelper = new MathjaxHelper(this.app, this.settings);
        this.mathjaxSuggest = new MathjaxSuggest(this.app, this.settings, this.mathjaxHelper);
        this.registerEditorSuggest(this.mathjaxSuggest);

		this.registerEditorExtension(subscriptHandler());


        this.addCommand(SelectNextSuggestCommand(this.mathjaxSuggest));
        this.addCommand(SelectPreviousSuggestCommand(this.mathjaxSuggest));
		this.addCommand(SelectNextPlaceholderCommand(this.mathjaxSuggest));
		this.addCommand(SelectPreviousPlaceholderCommand(this.mathjaxSuggest));
		this.addCommand(ShowMathjaxHelperOnCurrentSelection(this.mathjaxSuggest));
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}





