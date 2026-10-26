import {App, ButtonComponent, Component, MarkdownRenderer, Modal} from "obsidian";
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
			const descriptionEl = this.section("Description").createDiv({cls: "better-mathjax-description"});
			// Descriptions mix prose with $…$ math, so render them as Markdown.
			void MarkdownRenderer.render(this.app, symbol.description.join("\n\n"), descriptionEl, "", this.markdown);
		}

		if (symbol.examples.length) {
			const examples = this.section("Examples");
			for (const example of symbol.examples) {
				const row = examples.createDiv({cls: "better-mathjax-example"});
				row.createEl("code", {text: example.trim()});
				renderInlineMath(example, row.createDiv({cls: "better-mathjax-example-render"}), true);
			}
		}

		const related = symbol.seeAlso.filter((name) => registry.get(name));
		if (related.length) {
			const list = this.section("See also").createDiv({cls: "better-mathjax-see-also"});
			for (const name of related) {
				new ButtonComponent(list).setButtonText(name).onClick(() => {
					const target = registry.get(name);
					if (!target) return;
					this.close();
					new SymbolModal(this.app, target, this.plugin).open();
				});
			}
		}

		const snippet = this.section("Snippet");
		// An empty snippet inserts the name itself.
		snippet.createEl("pre", {cls: "better-mathjax-snippet-code", text: symbol.snippet || symbol.name});
		const customize = snippet.createDiv({cls: "better-mathjax-section-action"});
		customize.createDiv({
			cls: "setting-item-description",
			text: symbol.source === "builtin" ? "Change the snippet, description or examples for this symbol." : "You have customized this symbol.",
		});
		new ButtonComponent(customize)
			.setButtonText(symbol.source === "builtin" ? "Customize" : "Edit")
			.setCta()
			.onClick(() => {
				this.close();
				new SymbolEditorModal(this.app, this.plugin, symbol.name).open();
			});
	}

	/** A bordered box with a small heading; returns the box. */
	private section(title: string): HTMLElement {
		const box = this.contentEl.createDiv({cls: "better-mathjax-section"});
		box.createDiv({cls: "better-mathjax-section-title", text: title});
		return box;
	}

	override onClose(): void {
		this.markdown.unload();
		this.contentEl.empty();
	}
}
