import {App, SuggestModal} from "obsidian";
import type BetterMathjaxPlugin from "../main";
import {rank} from "../search/ranker";
import type {ResolvedSymbol} from "../symbols/types";
import {renderInlineMath} from "./math-preview";
import {SymbolEditorModal} from "./symbol-editor";

type Item = {kind: "new"; name: string} | {kind: "symbol"; symbol: ResolvedSymbol};

const SOURCE_LABEL: Record<ResolvedSymbol["source"], string> = {user: "custom", override: "customized", builtin: "built-in"};

/** Search all symbols and open one in the editor, or start a new one from the query. */
export class SymbolPickerModal extends SuggestModal<Item> {
	constructor(app: App, private readonly plugin: BetterMathjaxPlugin) {
		super(app);
		this.limit = 50;
		this.setPlaceholder("Search symbols to customize, or type a new name");
		this.setInstructions([
			{command: "↑↓", purpose: "to navigate"},
			{command: "↵", purpose: "to edit"},
			{command: "esc", purpose: "to dismiss"},
		]);
	}

	getSuggestions(query: string): Item[] {
		const {registry} = this.plugin;
		const trimmed = query.trim();
		if (trimmed === "") {
			// With no query, list the user's own symbols first so they are easy to find.
			const custom = registry.all().filter((symbol) => symbol.source !== "builtin");
			return [{kind: "new", name: ""}, ...custom.map((symbol): Item => ({kind: "symbol", symbol}))];
		}
		const name = trimmed.startsWith("\\") || !/^[A-Za-z]/.test(trimmed) ? trimmed : `\\${trimmed}`;
		const matches = rank(registry.all(), trimmed.replace(/^\\/, ""), this.limit).map((symbol): Item => ({kind: "symbol", symbol}));
		const exists = registry.get(name) !== undefined || registry.get(trimmed) !== undefined;
		return exists ? matches : [{kind: "new", name}, ...matches];
	}

	renderSuggestion(item: Item, el: HTMLElement): void {
		el.addClass("better-mathjax-suggestion");
		if (item.kind === "new") {
			el.createSpan({cls: "better-mathjax-suggestion-name", text: item.name === "" ? "New custom symbol…" : `Create ${item.name}`});
			return;
		}
		const {symbol} = item;
		el.createSpan({cls: "better-mathjax-suggestion-name", text: symbol.name});
		el.createSpan({cls: "better-mathjax-suggestion-badge", text: SOURCE_LABEL[symbol.source]}).toggleClass("is-builtin", symbol.source === "builtin");
		const preview = !symbol.preview ? null : symbol.examples[0] ?? (symbol.name.startsWith("\\") ? symbol.name : null);
		if (preview !== null) {
			const mathEl = el.createSpan({cls: "better-mathjax-suggestion-preview"});
			if (!renderInlineMath(preview, mathEl)) mathEl.remove();
		}
	}

	onChooseSuggestion(item: Item): void {
		new SymbolEditorModal(this.app, this.plugin, item.kind === "new" ? item.name : item.symbol.name).open();
	}
}
