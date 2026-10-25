import {App, debounce, Modal, Notice, Setting} from "obsidian";
import type BetterMathjaxPlugin from "../main";
import {PLACEHOLDER} from "../snippet/placeholders";
import type {SymbolEntry} from "../symbols/types";
import {renderInlineMath} from "./math-preview";

function toList(value: string | string[] | undefined): string[] {
	if (value === undefined) return [];
	return Array.isArray(value) ? value : [value];
}

function lines(text: string): string[] {
	return text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line !== "");
}

/** Form for creating a custom symbol or overriding a built-in one, with a live preview of the snippet. */
export class SymbolEditorModal extends Modal {
	private readonly originalName: string | null;
	private name: string;
	private snippet: string;
	private description: string;
	private examples: string;
	private seeAlso: string;
	private disabled: boolean;
	private statusEl!: HTMLElement;
	private previewEl!: HTMLElement;
	private readonly renderPreviewSoon = debounce(() => this.renderPreview(), 150, true);

	/** `name` opens that symbol (custom or built-in); without it the form starts empty. */
	constructor(app: App, private readonly plugin: BetterMathjaxPlugin, name = "") {
		super(app);
		const user = name === "" ? undefined : plugin.registry.userEntry(name);
		this.originalName = user ? user.name : null;
		this.name = name;
		this.snippet = user?.snippet ?? "";
		this.description = toList(user?.description).join("\n\n");
		this.examples = toList(user?.examples).join("\n");
		this.seeAlso = (user?.see_also ?? []).join(" ");
		this.disabled = user?.disabled === true;
	}

	override onOpen(): void {
		const {contentEl} = this;
		const builtin = () => this.plugin.registry.builtinSymbol(this.name.trim());
		this.titleEl.setText(this.originalName ? "Edit custom symbol" : builtin() ? `Customize ${this.name}` : "New custom symbol");
		contentEl.addClass("better-mathjax-editor");

		new Setting(contentEl)
			.setName("Name")
			.setDesc("A command such as \\R, or an environment name such as pmatrix.")
			.addText((text) => text
				.setPlaceholder("\\R")
				.setValue(this.name)
				.onChange((value) => {
					this.name = value;
					this.updateStatus();
					this.renderPreviewSoon();
				}));
		this.statusEl = contentEl.createDiv({cls: "better-mathjax-editor-status"});

		new Setting(contentEl)
			.setName("Snippet")
			.setDesc("Inserted when you accept the symbol. Mark the places to jump between with @1@, @2@, …")
			.setClass("better-mathjax-editor-wide")
			.addTextArea((text) => {
				text.setPlaceholder(builtin()?.snippet || (this.name.startsWith("\\") ? `${this.name}{@1@}` : "\\mathbb{@1@}")).setValue(this.snippet).onChange((value) => {
					this.snippet = value;
					this.renderPreviewSoon();
				});
				text.inputEl.rows = 3;
			});
		this.previewEl = contentEl.createDiv({cls: "better-mathjax-editor-preview"});

		new Setting(contentEl)
			.setName("Description")
			.setDesc("Shown in the symbol reference. Markdown and $math$ are supported.")
			.setClass("better-mathjax-editor-wide")
			.addTextArea((text) => {
				text.setValue(this.description).onChange((value) => (this.description = value));
				text.inputEl.rows = 3;
			});

		new Setting(contentEl)
			.setName("Examples")
			.setDesc("One per line. The first one is the preview in the suggestion list.")
			.setClass("better-mathjax-editor-wide")
			.addTextArea((text) => {
				text.setValue(this.examples).onChange((value) => (this.examples = value));
				text.inputEl.rows = 3;
			});

		new Setting(contentEl)
			.setName("See also")
			.setDesc("Related symbols, separated by spaces.")
			.addText((text) => text.setPlaceholder("\\mathbb \\mathcal").setValue(this.seeAlso).onChange((value) => (this.seeAlso = value)));

		new Setting(contentEl)
			.setName("Show in suggestions")
			.setDesc("If you turn this off, the symbol stays in the reference and the browser, but the suggestion list does not show it.")
			.addToggle((toggle) => toggle.setValue(!this.disabled).onChange((value) => (this.disabled = !value)));

		const buttons = new Setting(contentEl);
		if (this.originalName) {
			buttons.addButton((button) => button
				.setButtonText(this.plugin.registry.builtinSymbol(this.originalName!) ? "Reset to built-in" : "Delete")
				.setWarning()
				.onClick(() => void this.remove()));
		}
		buttons
			.addButton((button) => button.setButtonText("Cancel").onClick(() => this.close()))
			.addButton((button) => button.setButtonText("Save").setCta().onClick(() => void this.save()));

		this.updateStatus();
		this.renderPreview();
	}

	private updateStatus(): void {
		const name = this.name.trim();
		const {registry} = this.plugin;
		this.statusEl.empty();
		this.statusEl.removeClass("mod-warning");
		if (name === "") return;
		if (/\s/.test(name)) {
			this.statusEl.addClass("mod-warning");
			this.statusEl.setText("Names cannot contain spaces.");
		} else if (name !== this.originalName && registry.userEntry(name)) {
			this.statusEl.addClass("mod-warning");
			this.statusEl.setText(`You already have a custom ${name}. Saving replaces it.`);
		} else if (name === this.originalName && !registry.builtinSymbol(name)) {
			this.statusEl.setText("Your custom symbol.");
		} else if (registry.builtinSymbol(name)) {
			this.statusEl.setText(`Overrides the built-in ${name}. Fields you leave empty keep the built-in value.`);
		} else {
			this.statusEl.setText(name.startsWith("\\") ? "New command." : `New environment: inserts \\begin{${name}} … \\end{${name}} unless you give a snippet.`);
		}
	}

	private renderPreview(): void {
		this.previewEl.empty();
		const source = (this.snippet || this.plugin.registry.builtinSymbol(this.name.trim())?.snippet || this.name).trim();
		if (source === "" || !source.startsWith("\\")) return;
		// Show placeholders as boxes so the preview reads like the result.
		const math = source.replace(new RegExp(PLACEHOLDER.source, "g"), "\\square");
		if (!renderInlineMath(math, this.previewEl, true)) this.previewEl.setText("Cannot render this snippet.");
	}

	private entry(): SymbolEntry {
		return {
			name: this.name.trim(),
			snippet: this.snippet,
			description: this.description.trim(),
			examples: lines(this.examples),
			see_also: this.seeAlso.split(/[\s,]+/).filter((item) => item !== ""),
			disabled: this.disabled,
		};
	}

	private async save(): Promise<void> {
		const entry = this.entry();
		if (entry.name === "" || /\s/.test(entry.name)) {
			new Notice("Give the symbol a name without spaces.");
			return;
		}
		try {
			// Saving over another custom symbol of the same name replaces it, as the status line warns.
			if (this.originalName && this.originalName !== entry.name && this.plugin.registry.userEntry(entry.name)) {
				await this.plugin.customSymbols.remove(entry.name);
			}
			await this.plugin.customSymbols.save(entry, this.originalName ?? undefined);
			new Notice(`Saved ${entry.name}`);
			this.close();
		} catch (error) {
			new Notice(`Could not save: ${error instanceof Error ? error.message : String(error)}`, 6000);
		}
	}

	private async remove(): Promise<void> {
		if (!this.originalName) return;
		try {
			await this.plugin.customSymbols.remove(this.originalName);
			new Notice(`Removed your ${this.originalName}`);
			this.close();
		} catch (error) {
			new Notice(`Could not remove: ${error instanceof Error ? error.message : String(error)}`, 6000);
		}
	}

	override onClose(): void {
		this.contentEl.empty();
	}
}
