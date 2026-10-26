import {App, ButtonComponent, ExtraButtonComponent, Notice, PluginSettingTab, Setting, setIcon} from "obsidian";
import {COMMAND_IDS} from "../commands";
import type BetterMathjaxPlugin from "../main";
import {MarkdownFileSuggest} from "../ui/file-suggest";
import {hotkeyLabel, openHotkeySettings} from "./hotkey-internals";
import type {ActivationMode} from "./settings";

/** Commands that are only reachable through a hotkey, in the order they are shown. */
const HOTKEY_COMMANDS: {id: string; name: string; recommended: boolean}[] = [
	{id: COMMAND_IDS.nextPlaceholder, name: "Select next placeholder", recommended: true},
	{id: COMMAND_IDS.previousPlaceholder, name: "Select previous placeholder", recommended: true},
	{id: COMMAND_IDS.showReference, name: "Show symbol reference", recommended: true},
	{id: COMMAND_IDS.nextSuggestion, name: "Select next suggestion", recommended: false},
	{id: COMMAND_IDS.previousSuggestion, name: "Select previous suggestion", recommended: false},
	{id: COMMAND_IDS.acceptSuggestion, name: "Accept suggestion", recommended: false},
	{id: COMMAND_IDS.browseSymbols, name: "Browse custom symbols", recommended: false},
];

export class BetterMathjaxSettingTab extends PluginSettingTab {
	private unsubscribe: (() => void) | null = null;

	constructor(app: App, private readonly plugin: BetterMathjaxPlugin) {
		super(app, plugin);
	}

	override display(): void {
		const {containerEl, plugin} = this;
		const {settings} = plugin;
		containerEl.empty();
		this.renderHotkeyCallout(containerEl);

		new Setting(containerEl)
			.setName("Suggest symbols")
			.setDesc("Choose where a backslash command opens the suggestion list.")
			.addDropdown((dropdown) => dropdown
				.addOption("math", "Inside $…$ and $$…$$ only")
				.addOption("always", "Everywhere")
				.setValue(settings.activation)
				.onChange(async (value) => {
					settings.activation = value as ActivationMode;
					await plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Require a backslash")
			.setDesc("If you turn this on, only a backslash command or \\begin{ opens the suggestion list. If it is off, in math, the first letters of an environment name, such as pmat, also suggest the environment.")
			.addToggle((toggle) => toggle
				.setValue(settings.requireBackslash)
				.onChange(async (value) => {
					settings.requireBackslash = value;
					await plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Prefer snippets")
			.setDesc("If a symbol has a snippet, the plugin inserts the snippet instead of the name.")
			.addToggle((toggle) => toggle
				.setValue(settings.useSnippetFirst)
				.onChange(async (value) => {
					settings.useSnippetFirst = value;
					await plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Number of suggestions")
			.addSlider((slider) => slider
				.setLimits(1, 20, 1)
				.setValue(settings.maxSuggestions)
				.setDynamicTooltip()
				.onChange(async (value) => {
					settings.maxSuggestions = value;
					await plugin.saveSettings();
				}));

		this.renderAcceptKeySetting(containerEl);
		this.renderJumpKeySetting(containerEl);

		new Setting(containerEl)
			.setName("Preview symbols without examples")
			.setDesc("If a symbol has no example, the plugin renders the symbol itself. A few commands cannot render on their own.")
			.addToggle((toggle) => toggle
				.setValue(settings.previewWithoutExample)
				.onChange(async (value) => {
					settings.previewWithoutExample = value;
					await plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Format math when you leave it")
			.setDesc("When the cursor moves out of a math block, the plugin formats the block. Typing does not trigger it. You can undo the formatting.")
			.addToggle((toggle) => toggle
				.setValue(settings.formatOnLeave)
				.onChange(async (value) => {
					settings.formatOnLeave = value;
					await plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Auto-brace subscripts")
			.setDesc("In math, when you type _, the plugin inserts _{} and puts the cursor between the braces.")
			.addToggle((toggle) => toggle
				.setValue(settings.autoBraceSubscript)
				.onChange(async (value) => {
					settings.autoBraceSubscript = value;
					await plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Auto-brace superscripts")
			.setDesc("In math, when you type ^, the plugin inserts ^{} and puts the cursor between the braces.")
			.addToggle((toggle) => toggle
				.setValue(settings.autoBraceSuperscript)
				.onChange(async (value) => {
					settings.autoBraceSuperscript = value;
					await plugin.saveSettings();
				}));

		this.renderSymbolSection(containerEl);
	}

	override hide(): void {
		this.unsubscribe?.();
		this.unsubscribe = null;
	}

	/** Enter always accepts a suggestion; this picks the second key: Tab, or an Obsidian hotkey. */
	private renderAcceptKeySetting(containerEl: HTMLElement): void {
		const {plugin} = this;
		const {app, manifest, settings} = plugin;
		const hotkey = hotkeyLabel(app, `${manifest.id}:${COMMAND_IDS.acceptSuggestion}`) || "not set";

		const setting = new Setting(containerEl)
			.setName("Accept suggestion key")
			.setDesc(settings.acceptWithTab
				? "Enter or Tab inserts the highlighted suggestion."
				: `Enter or your "Accept suggestion" hotkey (${hotkey}) inserts the highlighted suggestion. Tab has no effect in the list.`)
			.addDropdown((dropdown) => dropdown
				.addOption("tab", "Enter or Tab")
				.addOption("hotkeys", "Enter or hotkey")
				.setValue(settings.acceptWithTab ? "tab" : "hotkeys")
				.onChange(async (value) => {
					settings.acceptWithTab = value === "tab";
					plugin.suggest.applyKeySettings();
					await plugin.saveSettings();
					this.display();
				}));
		if (!settings.acceptWithTab) {
			setting.addButton((button) => button.setButtonText("Set hotkey").onClick(() => {
				if (!openHotkeySettings(app, "accept suggestion")) new Notice("Open Settings → Hotkeys and search for \"accept suggestion\".");
			}));
		}
	}

	/** Tab, or Obsidian hotkeys for any other key, to move between snippet fields. */
	private renderJumpKeySetting(containerEl: HTMLElement): void {
		const {plugin} = this;
		const {app, manifest, settings} = plugin;
		const label = (id: string) => hotkeyLabel(app, `${manifest.id}:${id}`) || "not set";

		const setting = new Setting(containerEl)
			.setName("Placeholder jump key")
			.setDesc(settings.tabJumpsFields
				? "In a snippet, Tab moves to the next field. Shift + Tab moves to the previous field. Outside a snippet, Tab works as usual."
				: `The plugin uses your hotkeys for "Select next placeholder" (${label(COMMAND_IDS.nextPlaceholder)}) and "Select previous placeholder" (${label(COMMAND_IDS.previousPlaceholder)}).`)
			.addDropdown((dropdown) => dropdown
				.addOption("tab", "Tab / Shift + Tab")
				.addOption("hotkeys", "Hotkeys")
				.setValue(settings.tabJumpsFields ? "tab" : "hotkeys")
				.onChange(async (value) => {
					settings.tabJumpsFields = value === "tab";
					await plugin.saveSettings();
					plugin.applyJumpKey();
					this.display();
				}));
		if (!settings.tabJumpsFields) {
			setting.addButton((button) => button.setButtonText("Set hotkeys").onClick(() => {
				if (!openHotkeySettings(app, "placeholder")) new Notice("Open Settings → Hotkeys and search for \"placeholder\".");
			}));
		}
	}

	private renderSymbolSection(containerEl: HTMLElement): void {
		const {plugin} = this;
		const {registry} = plugin;
		new Setting(containerEl).setName("Custom symbols").setHeading();

		const summary = new Setting(containerEl)
			.setName("Your symbols")
			.addButton((button) => button
				.setButtonText("Add symbol")
				.setCta()
				.onClick(() => plugin.editSymbol()))
			.addButton((button) => button
				.setButtonText("Browse symbols")
				.onClick(() => plugin.browseAllSymbols()));
		const updateSummary = () => {
			const count = registry.userCount;
			const where = plugin.customSymbols.storage === "note" ? `in ${plugin.customSymbols.notePath}` : "with its settings";
			summary.setDesc(count === 0
				? "Add your own commands and snippets. In \"Browse symbols\", you can change or disable any built-in symbol."
				: `You have ${count} custom symbol${count === 1 ? "" : "s"}. The plugin stores ${count === 1 ? "it" : "them"} ${where}.`);
		};
		updateSummary();
		this.unsubscribe?.();
		this.unsubscribe = registry.subscribe(updateSummary);

		this.renderStorageSetting(containerEl);

		new Setting(containerEl)
			.setName("Backups")
			.setDesc("Before a change replaces or removes a symbol, the plugin saves a backup automatically. This includes changes to the symbol note from outside the plugin. Adding a new symbol does not create a backup. The plugin keeps the 10 newest backups in its own folder.")
			.addButton((button) => button
				.setButtonText("Restore…")
				.onClick(() => plugin.restoreSymbols()));

		new Setting(containerEl)
			.setName("Import from note")
			.setDesc("Copy symbols from another note into your custom symbols. The note must have a JSONL block, or a JSON or YAML block from before version 2.0. A symbol with the same name replaces your current one. The plugin does not change the other note.")
			.addButton((button) => button
				.setButtonText("Choose note")
				.onClick(() => plugin.importSymbolNote()));
	}

	/** Hidden in the plugin data, or a visible note that people and their agents can edit directly. */
	private renderStorageSetting(containerEl: HTMLElement): void {
		const {plugin} = this;
		const store = plugin.customSymbols;
		const inNote = store.storage === "note";

		new Setting(containerEl)
			.setName("Where symbols are stored")
			.setDesc(inNote
				? "The plugin stores the symbols in a note. Each line of a JSONL code block holds one symbol as a JSON object. You can edit the note directly. An agent that can edit your notes can also edit it. Changes apply each time someone saves the note."
				: "The plugin stores the symbols with its settings. Nothing appears in your notes. To edit the symbols, use \"Add symbol\" and \"Browse symbols\".")
			.addDropdown((dropdown) => dropdown
				.addOption("hidden", "Hidden (plugin settings)")
				.addOption("note", "Note in your vault")
				.setValue(store.storage)
				.onChange(async (value) => {
					try {
						const message = await store.setStorage(value === "note" ? "note" : "hidden");
						if (message) new Notice(message, 8000);
					} catch (error) {
						new Notice(`Better MathJax: ${error instanceof Error ? error.message : String(error)}`, 15000);
					}
					this.display();
				}));

		if (!inNote) return;
		new Setting(containerEl)
			.setName("Symbol note")
			.setDesc("Choose an existing note or type a new path. If you rename the note in Obsidian, this setting changes automatically.")
			.addSearch((search) => {
				search.setPlaceholder("Better MathJax Symbols.md").setValue(plugin.settings.symbolNotePath).onChange(async (value) => {
					const path = value.trim();
					if (!path.endsWith(".md")) return;
					plugin.settings.symbolNotePath = path;
					await plugin.saveSettings();
					await store.load();
				});
				new MarkdownFileSuggest(this.app, search.inputEl);
			})
			.addExtraButton((button) => button.setIcon("file-text").setTooltip("Open symbol note").onClick(() => void plugin.openSymbolNote()));
	}

	/** A prominent reminder to assign hotkeys, since the plugin ships without any. */
	private renderHotkeyCallout(containerEl: HTMLElement): void {
		const {plugin} = this;
		const {app, manifest, settings} = plugin;
		const setDismissed = async (dismissed: boolean) => {
			settings.hotkeyGuideDismissed = dismissed;
			await plugin.saveSettings();
			this.display();
		};

		if (settings.hotkeyGuideDismissed) {
			// Collapsed form: one ordinary row that can bring the guide back.
			new Setting(containerEl)
				.setName("Hotkeys")
				.setDesc("Assign keys to the placeholder commands and to the symbol reference command.")
				.addButton((button) => button
					.setButtonText("Open hotkey settings")
					.onClick(() => {
						if (!openHotkeySettings(app, manifest.name)) new Notice(`Open Settings → Hotkeys and search for "${manifest.name}".`);
					}))
				.addExtraButton((button) => button
					.setIcon("eye")
					.setTooltip("Show the hotkey guide")
					.onClick(() => void setDismissed(false)));
			return;
		}

		// With Tab as the jump key, the placeholder commands are optional.
		const placeholderIds: string[] = [COMMAND_IDS.nextPlaceholder, COMMAND_IDS.previousPlaceholder];
		const rows = HOTKEY_COMMANDS.map((command) => ({
			...command,
			recommended: command.recommended && !(settings.tabJumpsFields && placeholderIds.includes(command.id)),
			hotkey: hotkeyLabel(app, `${manifest.id}:${command.id}`),
		}));
		const missing = rows.filter((row) => row.recommended && row.hotkey === "").length;

		const callout = containerEl.createDiv({cls: "better-mathjax-hotkey-callout"});
		callout.toggleClass("is-done", missing === 0);
		const header = callout.createDiv({cls: "better-mathjax-hotkey-callout-title"});
		setIcon(header.createSpan({cls: "better-mathjax-hotkey-callout-icon"}), missing === 0 ? "check-circle" : "keyboard");
		header.createSpan({text: missing === 0 ? "Hotkeys are set up" : "Set up your hotkeys"});
		new ExtraButtonComponent(header)
			.setIcon("x")
			.setTooltip("Dismiss")
			.onClick(() => void setDismissed(true))
			.extraSettingsEl.addClass("better-mathjax-hotkey-callout-dismiss");

		callout.createEl("p", {
			text: missing === 0
				? "You can change your hotkeys at any time in Settings → Hotkeys."
				: settings.tabJumpsFields
					? "Better MathJax has no default hotkeys, so it cannot conflict with your hotkeys. Tab moves between placeholders. Without a hotkey, you cannot open the symbol reference."
					: "Better MathJax has no default hotkeys, so it cannot conflict with your hotkeys. Without hotkeys, you cannot move between placeholders or open the symbol reference.",
		});

		const list = callout.createDiv({cls: "better-mathjax-hotkey-list"});
		for (const row of rows) {
			const item = list.createDiv({cls: "better-mathjax-hotkey-row"});
			item.createSpan({text: row.name + (row.recommended ? "" : " (optional)")});
			if (row.hotkey === null) continue;
			if (row.hotkey === "") item.createSpan({cls: row.recommended ? "better-mathjax-hotkey-missing" : "better-mathjax-hotkey-unset", text: "Not set"});
			else item.createEl("kbd", {text: row.hotkey});
		}

		new ButtonComponent(callout)
			.setButtonText("Open hotkey settings")
			.setCta()
			.onClick(() => {
				if (!openHotkeySettings(app, manifest.name)) new Notice(`Open Settings → Hotkeys and search for "${manifest.name}".`);
			});
	}
}
