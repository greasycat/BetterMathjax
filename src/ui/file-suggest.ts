import {AbstractInputSuggest, App, TFile} from "obsidian";

/** Suggests Markdown notes for a path text field. */
export class MarkdownFileSuggest extends AbstractInputSuggest<TFile> {
	constructor(app: App, private readonly inputEl: HTMLInputElement) {
		super(app, inputEl);
	}

	protected getSuggestions(query: string): TFile[] {
		const lower = query.toLowerCase();
		return this.app.vault.getMarkdownFiles()
			.filter((file) => file.path.toLowerCase().includes(lower))
			.sort((a, b) => a.path.length - b.path.length)
			.slice(0, 20);
	}

	renderSuggestion(file: TFile, el: HTMLElement): void {
		el.setText(file.path);
	}

	override selectSuggestion(file: TFile, event: MouseEvent | KeyboardEvent): void {
		this.setValue(file.path);
		this.inputEl.dispatchEvent(new Event("input"));
		super.selectSuggestion(file, event);
		this.close();
	}
}
