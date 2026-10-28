import {App, ButtonComponent, DropdownComponent, ExtraButtonComponent, Modal, Notice, SearchComponent} from "obsidian";
import type BetterMathjaxPlugin from "../main";
import {browseSymbols, type BrowseFilter, type SourceFilter} from "../search/browse";
import type {ResolvedSymbol} from "../symbols/types";
import {renderInlineMath} from "./math-preview";
import {SymbolEditorModal} from "./symbol-editor";
import {SymbolModal} from "./symbol-modal";

/** Rows added per step while scrolling; the full table has over a thousand symbols. */
const PAGE = 60;

const SOURCE_LABEL: Record<ResolvedSymbol["source"], string> = {builtin: "built-in", override: "customized", user: "custom", document: "note"};

/** First line of a description as plain text, for a one-line summary. */
function summary(symbol: ResolvedSymbol): string {
	const first = symbol.description[0]?.split("\n").find((line) => line.trim() !== "") ?? "";
	return first.replace(/`/g, "").replace(/\\</g, "<");
}

/** Browse every symbol, built-in and custom: search, filter, preview, customize, and turn symbols on or off. */
export class SymbolBrowserModal extends Modal {
	private filter: BrowseFilter = {query: "", source: "all", pkg: null};
	private shown: ResolvedSymbol[] = [];
	private rendered = 0;
	private listEl!: HTMLElement;
	private statusEl!: HTMLElement;
	private bulkEl!: HTMLElement;
	private moreObserver: IntersectionObserver | null = null;
	private previewObserver: IntersectionObserver | null = null;
	private unsubscribe: (() => void) | null = null;

	constructor(app: App, private readonly plugin: BetterMathjaxPlugin, initial: Partial<BrowseFilter> = {}) {
		super(app);
		this.filter = {...this.filter, ...initial};
	}

	override onOpen(): void {
		const {contentEl, plugin} = this;
		this.modalEl.addClass("better-mathjax-browser");
		this.titleEl.setText("Browse symbols");

		const controls = contentEl.createDiv({cls: "better-mathjax-browser-controls"});
		const search = new SearchComponent(controls).setPlaceholder("Search by name or description").setValue(this.filter.query);
		search.onChange((value) => {
			this.filter.query = value;
			this.refresh();
		});
		new DropdownComponent(controls)
			.addOptions({all: "All symbols", builtin: "Built-in", customized: "Customized", custom: "My own", disabled: "Disabled"})
			.setValue(this.filter.source)
			.onChange((value) => {
				this.filter.source = value as SourceFilter;
				this.refresh();
			});
		const packages = new DropdownComponent(controls).addOption("", "All packages");
		for (const name of plugin.registry.packages()) packages.addOption(name, name);
		packages.setValue(this.filter.pkg ?? "").onChange((value) => {
			this.filter.pkg = value === "" ? null : value;
			this.refresh();
		});

		const bar = contentEl.createDiv({cls: "better-mathjax-browser-bar"});
		this.statusEl = bar.createDiv({cls: "better-mathjax-browser-status"});
		this.bulkEl = bar.createDiv({cls: "better-mathjax-browser-bulk"});
		this.listEl = contentEl.createDiv({cls: "better-mathjax-browser-list"});

		this.previewObserver = new IntersectionObserver((items) => {
			for (const item of items) {
				if (!item.isIntersecting) continue;
				this.previewObserver?.unobserve(item.target);
				const el = item.target as HTMLElement;
				const symbol = plugin.registry.get(el.dataset.name ?? "");
				const source = symbol && symbol.preview ? symbol.examples[0] ?? (symbol.name.startsWith("\\") ? symbol.name : null) : null;
				if (source === null || !renderInlineMath(source, el)) el.addClass("is-empty");
			}
		}, {root: this.listEl});
		this.moreObserver = new IntersectionObserver((items) => {
			if (items.some((item) => item.isIntersecting)) this.renderMore();
		}, {root: this.listEl});

		// Edits made from here (or anywhere else) change the registry; show them.
		this.unsubscribe = plugin.registry.subscribe(() => this.refresh(true));
		this.refresh();
		search.inputEl.focus();
	}

	/** Recompute the list. `keepScroll` keeps the position, for updates after an edit. */
	private refresh(keepScroll = false): void {
		const scroll = keepScroll ? this.listEl.scrollTop : 0;
		const keepRows = keepScroll ? Math.max(this.rendered, PAGE) : PAGE;
		const all = this.plugin.registry.all();
		this.shown = browseSymbols(all, this.filter);
		this.statusEl.setText(`Showing ${this.shown.length} of ${all.length} symbols`);
		this.renderBulk();

		this.moreObserver?.disconnect();
		this.previewObserver?.disconnect();
		this.listEl.empty();
		this.rendered = 0;
		if (this.shown.length === 0) this.listEl.createDiv({cls: "better-mathjax-browser-empty", text: "No symbols match."});
		while (this.rendered < Math.min(keepRows, this.shown.length)) this.renderMore(false);
		this.observeEnd();
		this.listEl.scrollTop = scroll;
	}

	private renderMore(observe = true): void {
		const end = Math.min(this.rendered + PAGE, this.shown.length);
		for (let i = this.rendered; i < end; i++) this.renderRow(this.shown[i]!);
		this.rendered = end;
		if (observe) this.observeEnd();
	}

	private observeEnd(): void {
		this.moreObserver?.disconnect();
		const last = this.listEl.lastElementChild;
		if (last && this.rendered < this.shown.length) this.moreObserver?.observe(last);
	}

	private renderRow(symbol: ResolvedSymbol): void {
		const row = this.listEl.createDiv({cls: "better-mathjax-browser-row"});
		row.toggleClass("is-disabled", symbol.disabled);

		const info = row.createDiv({cls: "better-mathjax-browser-info"});
		const head = info.createDiv({cls: "better-mathjax-browser-head"});
		const name = head.createEl("a", {cls: "better-mathjax-browser-name", text: symbol.name, href: "#"});
		name.addEventListener("click", (event) => {
			event.preventDefault();
			new SymbolModal(this.app, symbol, this.plugin).open();
		});
		head.createSpan({cls: `better-mathjax-tag is-${symbol.source}`, text: SOURCE_LABEL[symbol.source]});
		if (symbol.package) head.createSpan({cls: "better-mathjax-tag", text: symbol.package});
		if (symbol.disabled) head.createSpan({cls: "better-mathjax-tag is-disabled", text: "disabled"});
		const text = summary(symbol);
		if (text) info.createDiv({cls: "better-mathjax-browser-summary", text});

		const preview = row.createDiv({cls: "better-mathjax-browser-preview"});
		preview.dataset.name = symbol.name;
		this.previewObserver?.observe(preview);

		const actions = row.createDiv({cls: "better-mathjax-browser-actions"});
		new ExtraButtonComponent(actions)
			.setIcon(symbol.disabled ? "eye-off" : "eye")
			.setTooltip(symbol.disabled ? "Disabled: click to show it in suggestions" : "Shown in suggestions: click to disable")
			.onClick(() => void this.toggle([symbol.name], !symbol.disabled));
		new ButtonComponent(actions)
			.setButtonText(symbol.source === "builtin" ? "Customize" : "Edit")
			.onClick(() => new SymbolEditorModal(this.app, this.plugin, symbol.name).open());
	}

	/** "Disable shown" / "Enable shown". Two clicks when it affects more than one symbol. */
	private renderBulk(): void {
		this.bulkEl.empty();
		const names = this.shown.map((symbol) => symbol.name);
		// Bulk changes only for a narrowed list, so one click cannot turn off every symbol.
		const filtered = this.filter.query.trim() !== "" || this.filter.source !== "all" || this.filter.pkg !== null;
		if (names.length === 0 || !filtered) return;
		const enabledCount = this.shown.filter((symbol) => !symbol.disabled).length;
		const disabledCount = names.length - enabledCount;
		const confirmButton = (label: string, count: number, disabled: boolean) => {
			let armed = false;
			const button = new ButtonComponent(this.bulkEl).setButtonText(`${label} ${count}`);
			button.onClick(async () => {
				if (count > 1 && !armed) {
					armed = true;
					button.setButtonText(`Confirm: ${label.toLowerCase()} ${count}`).setWarning();
					return;
				}
				await this.toggle(names, disabled);
			});
		};
		if (enabledCount > 0) confirmButton("Disable", enabledCount, true);
		if (disabledCount > 0) confirmButton("Enable", disabledCount, false);
	}

	private async toggle(names: string[], disabled: boolean): Promise<void> {
		try {
			await this.plugin.customSymbols.setDisabled(names, disabled);
			if (names.length > 1) new Notice(`${disabled ? "Disabled" : "Enabled"} ${names.length} symbols.`);
		} catch (error) {
			new Notice(`Could not change the symbols: ${error instanceof Error ? error.message : String(error)}`, 8000);
		}
	}

	override onClose(): void {
		this.unsubscribe?.();
		this.moreObserver?.disconnect();
		this.previewObserver?.disconnect();
		this.contentEl.empty();
	}
}
