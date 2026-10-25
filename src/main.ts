import type {Extension} from "@codemirror/state";
import {loadMathJax, Notice, Plugin} from "obsidian";
import {registerCommands} from "./commands";
import {autoBraceExtension} from "./editor/auto-brace";
import {MathSuggest} from "./editor/math-suggest";
import {editorViewRegistry} from "./editor/editor-views";
import {snippetSessionExtension, snippetTabKeymap} from "./editor/snippet-session";
import {BetterMathjaxSettingTab} from "./settings/settings-tab";
import {BetterMathjaxSettings, legacySymbolNotePaths, migrateSettings} from "./settings/settings";
import builtinSymbols from "./symbols/builtin-symbols.json";
import {SymbolRegistry} from "./symbols/registry";
import {CustomSymbolStore} from "./symbols/custom-symbol-store";
import type {ResolvedSymbol, SymbolEntry} from "./symbols/types";
import {NoteImportModal} from "./ui/note-import";
import {RestoreModal} from "./ui/restore-modal";
import {SymbolBrowserModal} from "./ui/symbol-browser";
import {SymbolEditorModal} from "./ui/symbol-editor";
import {SymbolModal} from "./ui/symbol-modal";
import {SymbolPickerModal} from "./ui/symbol-picker";

export default class BetterMathjaxPlugin extends Plugin {
	override settings!: BetterMathjaxSettings;
	registry!: SymbolRegistry;
	customSymbols!: CustomSymbolStore;
	/** Registered once and refilled in place when the Tab setting changes, as Obsidian recommends. */
	private readonly jumpKeymap: Extension[] = [];
	suggest!: MathSuggest;

	override async onload(): Promise<void> {
		const stored: unknown = await this.loadData();
		this.settings = migrateSettings(stored);
		this.registry = new SymbolRegistry(builtinSymbols as SymbolEntry[]);
		this.customSymbols = new CustomSymbolStore(this);
		this.applyJumpKey();
		this.suggest = new MathSuggest(this);

		this.registerEditorSuggest(this.suggest);
		this.registerEditorExtension([
			autoBraceExtension(() => this.settings),
			snippetSessionExtension(),
			this.jumpKeymap,
			editorViewRegistry(),
		]);
		this.addSettingTab(new BetterMathjaxSettingTab(this.app, this));
		registerCommands(this);

		const legacyNotes = legacySymbolNotePaths(stored);
		this.app.workspace.onLayoutReady(async () => {
			this.customSymbols.watch();
			await Promise.all([loadMathJax(), this.customSymbols.load()]);
			if (legacyNotes) await this.customSymbols.migrateFromNotes(legacyNotes);
		});
	}

	override async onExternalSettingsChange(): Promise<void> {
		this.settings = migrateSettings(await this.loadData());
		this.suggest.applyKeySettings();
		this.applyJumpKey();
		await this.customSymbols.load();
	}

	/** Add or remove the Tab field-jump keymap to match the settings, in open editors too. */
	applyJumpKey(): void {
		this.jumpKeymap.length = 0;
		if (this.settings.tabJumpsFields) this.jumpKeymap.push(snippetTabKeymap(() => !this.suggest.isShowing()));
		this.app.workspace.updateOptions();
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	/** Open the editor for `name`, or an empty form. */
	editSymbol(name = ""): void {
		new SymbolEditorModal(this.app, this, name).open();
	}

	browseSymbols(): void {
		new SymbolPickerModal(this.app, this).open();
	}

	/** The full browser over built-in and custom symbols. */
	browseAllSymbols(): void {
		new SymbolBrowserModal(this.app, this).open();
	}

	async openSymbolNote(): Promise<void> {
		const file = this.app.vault.getFileByPath(this.customSymbols.notePath);
		if (file) await this.app.workspace.getLeaf("tab").openFile(file);
		else new Notice(`${this.customSymbols.notePath} does not exist yet. It is created when you save a symbol.`);
	}

	restoreSymbols(): void {
		new RestoreModal(this.app, this).open();
	}

	importSymbolNote(): void {
		new NoteImportModal(this.app, this).open();
	}

	showSymbol(symbol: ResolvedSymbol): void {
		new SymbolModal(this.app, symbol, this).open();
	}
}
