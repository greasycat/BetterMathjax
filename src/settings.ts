import {MathJaxSymbol} from "./mathjax-symbols";
import {App, PluginSettingTab, SplitDirection, Setting, TFile} from "obsidian";
import MyPlugin from "../main";

export interface BetterMathjaxSettings {
	mySetting: string;
	useSnippetFirst: boolean;
	maxSuggestionNumber: number;
	alwaysShowExamples: boolean; // Always show example even when not provided, this may lead to mathjax rendering issues

	autoEnabling: boolean; // enable the autocompletion automatically when inside $ (inline) or $$ (multiple lines)
	forceEnabling: boolean; // always enable the autocompletion
	userDefineSymbolFilePath: string;
	userDefinedSymbols: Map<string, MathJaxSymbol>;

	matchingSuperScript: boolean;
	matchingSubScript: boolean;



}

export const DEFAULT_SETTINGS: BetterMathjaxSettings = {
	mySetting: 'default',
	useSnippetFirst: true,
	maxSuggestionNumber: 5,
	alwaysShowExamples: true,
	autoEnabling: true,
	forceEnabling: false,

	matchingSubScript: true,
	matchingSuperScript: true,

	userDefinedSymbols: new Map<string, MathJaxSymbol>(),
	userDefineSymbolFilePath: "symbols.md"
}
export class BetterMathjaxSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for BetterMathjax.'});

		new Setting(containerEl)
			.setName('Use snippet first')
			.setDesc('Snippet will always be used for autocompletion instead of the symbol name unless the snippet is not provided.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.useSnippetFirst)
				.onChange(async (value) => {
					this.plugin.settings.useSnippetFirst = value;
					await this.plugin.saveSettings();
				}
			));

		new Setting(containerEl)
			.setName('Max suggestion number')
			.setDesc('Maximum number of suggestions to show')
			.addText(text => text
				.setValue(this.plugin.settings.maxSuggestionNumber.toString())
				.onChange(async (value) => {
					this.plugin.settings.maxSuggestionNumber = parseInt(value);
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Always show examples')
			.setDesc('Always show example even when not provided, this may lead to mathjax rendering issues')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.alwaysShowExamples)
				.onChange(async (value) => {
					this.plugin.settings.alwaysShowExamples = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Auto enabling')
			.setDesc('Enable the autocompletion automatically when inside $ (inline) or $$ (multiple lines)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.autoEnabling)
				.onChange(async (value) => {
					this.plugin.settings.autoEnabling = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Force enabling')
			.setDesc('Always enable the autocompletion (even when not inside $ or $$)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.forceEnabling)
				.onChange(async (value) => {
					this.plugin.settings.forceEnabling = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Matching super script')
			.setDesc('Match the super script when typing')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.matchingSuperScript)
				.onChange(async (value) => {
					this.plugin.settings.matchingSuperScript = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Matching sub script')
			.setDesc('Match the sub script when typing')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.matchingSubScript)
				.onChange(async (value) => {
					this.plugin.settings.matchingSubScript = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('User defined symbols filepath')
			.setDesc('The file that contains the user defined symbols (must be markdown file)')
			.addText(text => text
				.setValue(this.plugin.settings.userDefineSymbolFilePath)
				.setPlaceholder("user-defined-symbols.md")
				.onChange(async (value) => {
					this.plugin.settings.userDefineSymbolFilePath = value;
					await this.plugin.saveSettings();
				}))
			.addButton(button => button
				.setButtonText("Open")
				.onClick(async () => {
					const file = this.app.vault.getAbstractFileByPath(this.plugin.settings.userDefineSymbolFilePath);
					if (file instanceof TFile) {
						await this.app.workspace.getLeaf("split", "vertical" ).openFile(file);
					}
				})
			)


	}
}
