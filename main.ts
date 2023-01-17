import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import {Extension, Prec} from '@codemirror/state';
import {KeyBinding, keymap} from '@codemirror/view';
import MathjaxSuggest from './src/mathjax-suggest';
import {
	SelectNextSuggestCommand,
	SelectPreviousSuggestCommand,
	SelectNextPlaceholderCommand,
	SelectPreviousPlaceholderCommand,
	ShowMathjaxHelperOnCurrentSelection,
} from './src/commands';
import {BetterMathjaxSettings, DEFAULT_SETTINGS} from "./src/settings";
import {MathjaxHelper} from "./src/mathjax-helper";


// Remember to rename these classes and interfaces!



export default class MyPlugin extends Plugin {
	settings: BetterMathjaxSettings;
	mathjaxHelper: MathjaxHelper;
    mathjaxSuggest: MathjaxSuggest;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
        
        // Register keyRemapExtension
        // this.registerEditorExtension(this.keyRemapExtension())
        //
		this.mathjaxHelper = new MathjaxHelper(this.app, this.settings);
        this.mathjaxSuggest = new MathjaxSuggest(this.app, this.settings, this.mathjaxHelper);
        this.registerEditorSuggest(this.mathjaxSuggest);


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
    private readonly keyRemapExtension = (): Extension => {
        const keymaps: KeyBinding[] = []
        keymaps.push({
            key: "",
            run() { console.log("key pressed"); return true; }
        })
        return Prec.low([keymap.of(keymaps)])
    }

}




class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
