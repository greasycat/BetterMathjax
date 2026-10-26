import {Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo, KeymapEventHandler, TFile} from "obsidian";
import type BetterMathjaxPlugin from "../main";
import {mathModeAt} from "../math/context";
import {viewForEditor} from "./editor-views";
import {mathModeInState} from "./math-scan-cache";
import {rank} from "../search/ranker";
import type {ResolvedSymbol} from "../symbols/types";
import {renderInlineMath} from "../ui/math-preview";
import {insertSymbol} from "./insert";
import {selectedIndex} from "./suggest-internals";
import {detectTrigger, type Trigger} from "./trigger";

const isEnvironment = (symbol: ResolvedSymbol) => /^[A-Za-z]+\*?$/.test(symbol.name);

export class MathSuggest extends EditorSuggest<ResolvedSymbol> {
	private shown: ResolvedSymbol[] = [];
	// Not `isOpen`: PopoverSuggest already has an undocumented field by that name.
	private shownNow = false;
	/** Cursor right after an accepted completion; the finished `\name` there must not re-open the popup. */
	private suppressAt: EditorPosition | null = null;
	private tabHandler: KeymapEventHandler | null = null;
	// Not `trigger`: EditorSuggest.trigger() is the method Obsidian calls on every keystroke.
	private activeTrigger: Trigger | null = null;

	constructor(private readonly plugin: BetterMathjaxPlugin) {
		super(plugin.app);
		this.applyKeySettings();
	}

	/** Bind or unbind Tab as an accept key to match the settings. Call again after they change. */
	applyKeySettings(): void {
		const acceptWithTab = this.plugin.settings.acceptWithTab;
		if (acceptWithTab && !this.tabHandler) {
			this.tabHandler = this.scope.register([], "Tab", (event) => {
				this.acceptSelected(event);
				return false;
			});
		} else if (!acceptWithTab && this.tabHandler) {
			this.scope.unregister(this.tabHandler);
			this.tabHandler = null;
		}
		this.setInstructions([
			{command: "↑↓", purpose: "to navigate"},
			{command: acceptWithTab ? "↵ or tab" : "↵", purpose: "to insert"},
			{command: "esc", purpose: "to dismiss"},
		]);
	}

	isShowing(): boolean {
		return this.shownNow;
	}

	override open(): void {
		super.open();
		this.shownNow = true;
	}

	override close(): void {
		super.close();
		this.shownNow = false;
	}

	onTrigger(cursor: EditorPosition, editor: Editor, _file: TFile | null): EditorSuggestTriggerInfo | null {
		if (this.suppressAt) {
			const same = this.suppressAt.line === cursor.line && this.suppressAt.ch === cursor.ch;
			this.suppressAt = null;
			if (same) return null;
		}

		// Cheap line check first: this runs on every keystroke.
		const {settings} = this.plugin;
		const line = editor.getLine(cursor.line);
		const trigger = detectTrigger(line.slice(0, cursor.ch), line.slice(cursor.ch), !settings.requireBackslash);
		if (!trigger) return null;
		// Bare words only count inside math, whatever the activation setting: in prose they are just words.
		const needsMath = trigger.kind === "word" || settings.activation === "math";
		if (needsMath && !this.inMath(editor, cursor)) return null;

		this.activeTrigger = trigger;
		return {start: {line: cursor.line, ch: trigger.from}, end: {line: cursor.line, ch: cursor.ch + trigger.extend}, query: trigger.query};
	}

	/** Whether the cursor is in math. Uses the editor's cached scan, so typing does not rescan the whole note. */
	private inMath(editor: Editor, cursor: EditorPosition): boolean {
		const view = viewForEditor(editor);
		const pos = editor.posToOffset(cursor);
		// Use the view only when it is the same document as the editor (same line count, the cursor inside it).
		if (view && view.state.doc.lines === editor.lineCount() && pos <= view.state.doc.length) {
			return mathModeInState(view.state, pos) !== null;
		}
		return mathModeAt(editor.getRange({line: 0, ch: 0}, cursor)) !== null;
	}

	getSuggestions(context: EditorSuggestContext): ResolvedSymbol[] {
		const limit = this.plugin.settings.maxSuggestions;
		this.limit = limit;
		const symbols = this.plugin.registry.enabled();
		switch (this.activeTrigger?.kind) {
			case "begin":
				this.shown = rank(symbols.filter(isEnvironment), context.query, limit);
				break;
			case "word": {
				// Only names that start with the word, so ordinary variables rarely open the list.
				const prefix = context.query.toLowerCase();
				this.shown = rank(symbols.filter(isEnvironment), context.query, symbols.length)
					.filter((symbol) => symbol.key.toLowerCase().startsWith(prefix))
					.slice(0, limit);
				break;
			}
			default:
				this.shown = rank(symbols, context.query, limit);
		}
		return this.shown;
	}

	renderSuggestion(symbol: ResolvedSymbol, el: HTMLElement): void {
		el.addClass("better-mathjax-suggestion");
		el.createSpan({cls: "better-mathjax-suggestion-name", text: symbol.name});
		if (symbol.source !== "builtin") el.createSpan({cls: "better-mathjax-suggestion-badge", text: "custom"});

		const preview = !symbol.preview ? null : symbol.examples[0] ??
			(this.plugin.settings.previewWithoutExample && symbol.name.startsWith("\\") ? symbol.name : null);
		if (preview !== null) {
			const mathEl = el.createSpan({cls: "better-mathjax-suggestion-preview"});
			if (!renderInlineMath(preview, mathEl)) mathEl.remove();
		}
	}

	selectSuggestion(symbol: ResolvedSymbol, _event: MouseEvent | KeyboardEvent): void {
		const context = this.context;
		if (!context) return;
		this.suppressAt = insertSymbol(context.editor, symbol, context.start, context.end, this.plugin.settings.useSnippetFirst);
		this.close();
	}

	/** Insert the highlighted suggestion. Returns false if the popup is closed or the selection is unknown. */
	acceptSelected(event: KeyboardEvent = new KeyboardEvent("keydown")): boolean {
		const symbol = this.selectedSymbol();
		if (!symbol) return false;
		this.selectSuggestion(symbol, event);
		return true;
	}

	/** The highlighted suggestion while the popup is open. */
	selectedSymbol(): ResolvedSymbol | null {
		if (!this.shownNow) return null;
		const index = selectedIndex(this);
		return index === null ? null : this.shown[index] ?? null;
	}
}
