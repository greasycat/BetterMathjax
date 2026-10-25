import {App, ButtonComponent, Component, MarkdownRenderer, Modal, Setting} from "obsidian";
import type BetterMathjaxPlugin from "../main";
import type {ResolvedSymbol} from "../symbols/types";
import {renderInlineMath} from "./math-preview";
import {SymbolEditorModal} from "./symbol-editor";

/** Reference card for one symbol. */
export class SymbolModal extends Modal {
	private readonly markdown = new Component();

	constructor(app: App, private readonly symbol: ResolvedSymbol, private readonly plugin: BetterMathjaxPlugin) {
		super(app);
	}

	override onOpen(): void {
		const {contentEl, symbol} = this;
		const {registry} = this.plugin;
		this.markdown.load();
		this.titleEl.setText(symbol.name);
		contentEl.addClass("better-mathjax-modal");

		if (symbol.description.length) {
			const descriptionEl = contentEl.createDiv({cls: "better-mathjax-description"});
			// Descriptions mix prose with $…$ math, so render them as Markdown.
			void MarkdownRenderer.render(this.app, symbol.description.join("\n\n"), descriptionEl, "", this.markdown);
		}

		if (symbol.examples.length) {
			new Setting(contentEl).setName("Examples").setHeading();
			for (const example of symbol.examples) {
				const row = contentEl.createDiv({cls: "better-mathjax-example"});
				row.createEl("code", {text: example.trim()});
				renderInlineMath(example, row.createDiv({cls: "better-mathjax-example-render"}), true);
			}
		}

		const related = symbol.seeAlso.filter((name) => registry.get(name));
		if (related.length) {
			new Setting(contentEl).setName("See also").setHeading();
			const list = contentEl.createDiv({cls: "better-mathjax-see-also"});
			for (const name of related) {
				new ButtonComponent(list).setButtonText(name).onClick(() => {
					const target = registry.get(name);
					if (!target) return;
					this.close();
					new SymbolModal(this.app, target, this.plugin).open();
				});
			}
		}

		new Setting(contentEl).setName("Snippet").setHeading();
		if (symbol.snippet !== "") contentEl.createEl("pre", {cls: "better-mathjax-snippet-code", text: symbol.snippet});
		new Setting(contentEl)
			.setDesc(symbol.source === "builtin" ? "Change the snippet, description or examples for this symbol." : "You have customized this symbol.")
			.addButton((button) => button
				.setButtonText(symbol.source === "builtin" ? "Customize" : "Edit")
				.setCta()
				.onClick(() => {
					this.close();
					new SymbolEditorModal(this.app, this.plugin, symbol.name).open();
				}));
	}

	override onClose(): void {
		this.markdown.unload();
		this.contentEl.empty();
	}
}
