import {MathJaxSymbol} from "./mathjax-symbols";
import {App, PluginSettingTab, Setting, TFile, Notice, TAbstractFile} from "obsidian";
import BetterMathjaxPlugin from "./main";
import {FuzzySearchType} from "./mathjax-search";
import Logger from "./logger";

export interface BetterMathjaxSettings {
	//suggest settings
	useSnippetFirst: boolean;
	maxSuggestionNumber: number;
	alwaysShowExamples: boolean; // Always show example even when not provided, this may lead to mathjax rendering issues

	autoEnabling: boolean; // enable the autocompletion automatically when inside $ (inline) or $$ (multiple lines)
	forceEnabling: boolean; // always enable the autocompletion

	// user defined symbols
	userDefineSymbolFilePath: string;
	userDefinedSymbols: Map<string, MathJaxSymbol>;

	// quick pairing
	matchingSuperScript: boolean;
	matchingSubScript: boolean;

	// fuzzy search
	fuzzySearchType: FuzzySearchType;

	// other settings
	debugMode: boolean;
}

export const DEFAULT_SETTINGS: BetterMathjaxSettings = {
	//auto suggestion settings
	useSnippetFirst: true,
	maxSuggestionNumber: 5,
	alwaysShowExamples: true,
	autoEnabling: true,
	forceEnabling: false,

	// quick pairing
	matchingSubScript: true,
	matchingSuperScript: true,

	// user defined symbols
	userDefinedSymbols: new Map<string, MathJaxSymbol>(),
	userDefineSymbolFilePath: "symbols.md",

	// fuzzy search type
	fuzzySearchType: "LCS",

	// misc
	debugMode: false,
};

export class BetterMathjaxSettingTab extends PluginSettingTab {
	plugin: BetterMathjaxPlugin;
	lastNoticeTime: number;

	constructor(app: App, plugin: BetterMathjaxPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.lastNoticeTime = 0;
	}

	showNotice(message: string, timeout = 3000) {
		if (Date.now() - this.lastNoticeTime > timeout) {
			new Notice(message);
			this.lastNoticeTime = Date.now();
		}
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
					// regex to check if the path is a markdown file
					if (value.match(/.*\.md$/)) {
						this.plugin.settings.userDefineSymbolFilePath = value;
						await this.plugin.saveSettings();
					} else {
						this.showNotice("The file should be a markdown file, otherwise it may not appear in the Obsidian file explorer.", 3000);
					}

				}))
			.addButton(button => button
				.setButtonText("Generate")
				.onClick(async () => {
					const file = this.app.vault.getAbstractFileByPath(this.plugin.settings.userDefineSymbolFilePath);

					if (file instanceof TFile) {
						// read the file if empty then generate the default
						const content = await this.app.vault.read(file);
						if (content && content.trim() === "") {
							new Notice("Generating default user defined symbols", 3000);
							await this.app.vault.modify(file, generateDefaultUserDefinedSymbols());

						} else {
							new Notice("User defined symbols already exists, if you still want the sample code, delete the file", 3000);
						}
					} else {
						this.app.vault.create(this.plugin.settings.userDefineSymbolFilePath, generateDefaultUserDefinedSymbols()).then((file) => {
							if (file === null) {
								new Notice("Failed to create the file, make sure the path is correct.", 3000);
							}
							this.plugin.mathjaxHelper.readUserDefinedSymbols();
						});
					}
				}))
			.addButton(button => button
				.setButtonText("Open")
				.onClick(async () => {
					const file = this.app.vault.getAbstractFileByPath(this.plugin.settings.userDefineSymbolFilePath);
					if (file instanceof TFile) {
						await this.app.workspace.getLeaf("split", "vertical").openFile(file);
					} else {
						new Notice("The file does not exist", 3000);
					}
				})
			)
			.addButton(button => button
				.setButtonText("Reload")
				.onClick(async () => {
					this.plugin.mathjaxHelper.readUserDefinedSymbols().then(() => {
						new Notice("Reloaded user defined symbols", 3000);
					});
				}));


		new Setting(containerEl)
			.setName("Fuzzy search type")
			.setDesc("Select the fuzzy search algorithm")
			.addDropdown(dropdown => {
				dropdown.addOption("LCS", "Longest common subsequence");
				dropdown.addOption("DLD", "Damerau-Levenshtein distance");
				dropdown.setValue(this.plugin.settings.fuzzySearchType);
				dropdown.onChange(async (value) => {
					switch (value) {
						case "LCS":
							this.plugin.settings.fuzzySearchType = "LCS";
							break;
						case "DLD":
							this.plugin.settings.fuzzySearchType = "DLD";
							break;

					}
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Debug mode")
			.setDesc("Enable debug mode to see the console log")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.debugMode)
				.onChange(async (value) => {
						Logger.instance.setConsoleLogEnabled(value);
						this.plugin.settings.debugMode = value;
						await this.plugin.saveSettings();
					}
				));


	}
}


export function userDefinedFileChanged(file: TAbstractFile) {
	if (file.path === this.settings.userDefineSymbolFilePath) {
		this.mathjaxHelper.readUserDefinedSymbols().then((status: boolean) => {
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

function generateDefaultUserDefinedSymbols(): string {
	return "```note\n" +
		"- Use can use either json or yaml to customize your snippets (but be careful with \"\" and indent when using yaml\n" +
		"- If any of the field (e.g. description) is set to empty \"\" or [], then the default value will be used\n" +
		"- Everything in the note section will be saved\n" +
		"- Avoid putting a comma in the end of the json file\n" +
		"```\n" +
		"\n" +
		"```json\n" +
		"[\n" +
		"  {\n" +
		"    \"name\": \"\\\\int\",\n" +
		"    \"snippet\": \"\\\\int_{@1@}^{@2@}\",\n" +
		"    \"description\": \"\",\n" +
		"    \"examples\": \"\",\n" +
		"    \"see_also\": []\n" +
		"  },\n" +
		"  {\n" +
		"    \"name\": \"\\\\sum\",\n" +
		"    \"snippet\": \"\\\\sum_{@1@}^{@2@}\",\n" +
		"    \"description\": \"\",\n" +
		"    \"examples\": \"\",\n" +
		"    \"see_also\": []\n" +
		"  }\n" +
		"]\n" +
		""
}
