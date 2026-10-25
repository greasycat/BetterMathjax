import {App, FuzzySuggestModal, Notice, TFile} from "obsidian";
import type BetterMathjaxPlugin from "../main";

/** Pick a note in the old symbol-note format and import its symbols. */
export class NoteImportModal extends FuzzySuggestModal<TFile> {
	constructor(app: App, private readonly plugin: BetterMathjaxPlugin) {
		super(app);
		this.setPlaceholder("Choose a note with a json or yaml block of symbols");
	}

	getItems(): TFile[] {
		return this.app.vault.getMarkdownFiles();
	}

	getItemText(file: TFile): string {
		return file.path;
	}

	onChooseItem(file: TFile): void {
		void this.plugin.customSymbols.importNote(file.path).then((result) => new Notice(result.message, 8000));
	}
}
