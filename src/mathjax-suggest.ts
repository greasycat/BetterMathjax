import {
	Editor,
	EditorPosition,
	EditorSuggest,
	EditorSuggestContext,
	EditorSuggestTriggerInfo,
	finishRenderMath, Notice,
	Plugin,
	renderMath,
	TFile
} from 'obsidian';
import {MathjaxHelper} from './mathjax-helper';
import {BetterMathjaxSettings} from "./settings";
import Logger from "./logger";
import { addSubSuperScriptCommand, removeSubSuperScriptCommand } from './commands';
import {getSymbolFromQuery, MathJaxSymbolQuery} from "./mathjax-search";

export default class MathjaxSuggest extends EditorSuggest<MathJaxSymbolQuery> {
	private mathjaxHelper: MathjaxHelper;
	private editor: Editor;
	private readonly settings: BetterMathjaxSettings;

	private readonly plugin: Plugin;

	public enabled: boolean;

	private startPos: EditorPosition;
	private endPos: EditorPosition;
	private suggestionTired: boolean;

	private startup: boolean;

	constructor(plugin: Plugin, settings: BetterMathjaxSettings, mathjaxHelper: MathjaxHelper) {
		super(plugin.app);
		this.plugin = plugin;
		this.mathjaxHelper = mathjaxHelper;
		this.settings = settings;
		this.startup = true;
	}

	getSuggestions(context: EditorSuggestContext): MathJaxSymbolQuery[] {
		// convert the item in results to a string[]
		return this.mathjaxHelper.search(context.query, this.settings.maxSuggestionNumber);
	}

	onTrigger(cursor: EditorPosition, editor: Editor, file: TFile): EditorSuggestTriggerInfo | null {
		if (this.startup) {
			this.mathjaxHelper.readUserDefinedSymbols().then(() => {
				Logger.instance.info("Startup finished");
				this.startup = false;
			});
		}

		if (this.suggestionTired) {
			this.suggestionTired = false;
			return null;
		}

		this.editor = editor;

		this.enabled = false;
		if (this.settings.forceEnabling) {
			this.enabled = true;
		} else {
			if (this.settings.autoEnabling) {
				const text = this.getTextBeforeCursor(cursor);
				this.enabled = this.checkMathjaxEnvironment(text)
			}

			if (!this.enabled) {
				removeSubSuperScriptCommand(this.plugin);
				return null;
			}
		}

		addSubSuperScriptCommand(this.plugin, this, this.settings);


		const word = this.getWord(this.getCurrentLineBeforeCursor(cursor));

		this.startPos = {line: cursor.line, ch: cursor.ch - word.length};
		this.endPos = cursor;

		if (word !== "") {
			return {start: this.startPos, end: cursor, query: word};
		}

		return null;

	}

	async renderSuggestion(suggestion: MathJaxSymbolQuery, el: HTMLElement): Promise<void> {
		const symbol = getSymbolFromQuery(suggestion);
		el.setText(symbol.name);
		// Create new element
		const mathSpan = el.createSpan();

		try {
			let example = symbol.name;
			// check the type of examples, if string and not empty then use it, if array and not empty then use the first element
			if (typeof symbol.examples === "string" && symbol.examples !== "") {
				example = symbol.examples;
			} else if (Array.isArray(symbol.examples) && symbol.examples.length > 0) {
				example = symbol.examples[0];
			}

			//Logger.instance.info(example)
			const mathEl = renderMath(example, false);
			await finishRenderMath();
			mathSpan.addClass("better-mathjax-suggestion-math-entry");
			mathSpan.appendChild(mathEl);
		} catch (ReferenceError) {
			new Notice("Error rendering mathjax");
			Logger.instance.error("Error rendering mathjax");
		}


	}

	selectSuggestion(suggestion: MathJaxSymbolQuery, evt: MouseEvent | KeyboardEvent): void {
		const symbol = getSymbolFromQuery(suggestion);
		const pos = this.startPos;
		// pos.ch = pos.ch - 1;
		if (this.settings.useSnippetFirst && symbol.snippet !== undefined && symbol.snippet !== "") {
			this.editor.replaceRange(symbol.snippet, this.startPos, this.endPos);
			this.editor.setCursor(pos);

			this.selectNextPlaceholder();
		} else {
			this.editor.replaceRange(symbol.name, pos, this.endPos);
		}
		this.close();
		this.suggestionTired = true;
	}
	getCurrentLineBeforeCursor(pos: EditorPosition): string {
		return this.editor.getLine(pos.line).slice(0, pos.ch);
	}

	// Function to get the text before the cursor and after a backslash
	// if there is one space before the cursor and after the backslash
	// then return ""
	getWord(text: string): string {

		// Regex to match a word after a backslash and before the end of the line
		const regex = /(\\\w+)$/;
		const match = text.match(regex);
		if (!match) {
			return "";
		}
		return match[1];
	}

	getTextBeforeCursor(pos: EditorPosition): string {
		let text = "";
		for (let i = 0; i < pos.line; i++) {
			text += this.editor.getLine(i) + " ";
		}

		text += this.getCurrentLineBeforeCursor(pos);
		return text;
	}


	checkMathjaxEnvironment(text: string): boolean {
		// check if the text is in a mathjax environment using stack
		// the start of a mathjax environment is $ or $$
		// the end of a mathjax environment is $ or $$
		// if the stack is empty then we are not in a mathjax environment
		// if the stack is not empty then we are in a mathjax environment
		const stack: string[] = [];
		const regex = /(\$\$|\$)/g;
		let match;
		while ((match = regex.exec(text)) !== null) {
			if (stack.length === 0) {
				stack.push(match[1]);
			} else {
				if (stack[stack.length - 1] === match[1]) {
					stack.pop();
				} else {
					stack.push(match[1]);
				}
			}
		}
		// Logger.instance.info("DEBUG: stack length:", stack.length);
		return stack.length !== 0;
	}


	selectNextSuggestion(): void {
		// Thanks to github@tth05 for this hack
		// And thanks to Obsidian team who made this hack possible by not providing a doc for this (yet)

		/* eslint-disable */
		(this as any).suggestions.setSelectedItem((this as any).suggestions.selectedItem + 1, new KeyboardEvent("keydown"));
		/* eslint-enable */
	}

	selectPreviousSuggestion(): void {
		/* eslint-disable */
		(this as any).suggestions.setSelectedItem((this as any).suggestions.selectedItem - 1, new KeyboardEvent("keydown"));
		/* eslint-enable */
	}


	selectNextPlaceholder(): void {
		const pos = this.editor.getCursor();
		// If already selected, move to the next placeholder by adding the length of the placeholder to the pos
		if (this.editor.somethingSelected()) {
			const selectedText = this.editor.getSelection();
			pos.ch += selectedText.length - 1;
		}

		const currentLineNumber = pos.line;
		const maxLineNumber = this.editor.lastLine();

		let bracketPositions;
		let firstBracketPosition = true;
		// Iterate over each line unless find a placeholder in format @1@, @2@, @3@, etc.
		for (let lineNumber = currentLineNumber; lineNumber <= maxLineNumber; lineNumber++) {
			let line = "";
			if (lineNumber !== currentLineNumber) {
				line = this.editor.getLine(lineNumber);
			} else {
				// get the text after the cursor
				line = this.editor.getLine(lineNumber).slice(pos.ch);
			}

			Logger.instance.info("lineNumber:", lineNumber);
			Logger.instance.info("currentLineNumber:", currentLineNumber);
			Logger.instance.info("pos.ch:", pos.ch);

			const placeHolderRegex = /@(\S)@/g;
			let match;
			if ((match = placeHolderRegex.exec(line)) !== null) {
				Logger.instance.info("Placeholder found");
				const placeholderStartPos = {line: lineNumber, ch: pos.ch + match.index};
				const placeholderEndPos = {line: lineNumber, ch: pos.ch + match.index + match[0].length};
				this.editor.setSelection(placeholderStartPos, placeholderEndPos);
				return;
			}

			const endBracketRegex = /}/g;
			while ((match = endBracketRegex.exec(line)) !== null && firstBracketPosition) {
				Logger.instance.info("End bracket found");
				bracketPositions = {line: lineNumber, ch: pos.ch + match.index+1};
				firstBracketPosition = false;
			}
			pos.ch = 0;
		}

		if (bracketPositions) {
			this.editor.setCursor(bracketPositions);
		}

	}

	selectPreviousPlaceholder(): void {
		const pos = this.editor.getCursor();
		// If already selected, move to the next placeholder by adding the length of the placeholder to the pos
		if (this.editor.somethingSelected()) {
			const selectedText = this.editor.getSelection();
			pos.ch -= selectedText.length - 1;
		}

		const currentLineNumber = pos.line;
		const minLineNumber = 0;

		// Iterate over each line unless find a placeholder in format @1@, @2@, @3@, etc.
		for (let lineNumber = currentLineNumber; lineNumber >= minLineNumber; lineNumber--) {
			let line = "";
			if (lineNumber !== currentLineNumber) {
				line = this.editor.getLine(lineNumber);
			} else {
				// get the text before the cursor
				line = this.editor.getLine(lineNumber).slice(0, pos.ch);
			}
			// match the last placeholder in the line
			const regex = /@(\d+)@/g;
			let match;
			let lastMatch;
			while ((match = regex.exec(line)) !== null) {
				lastMatch = match;
			}
			if (lastMatch !== undefined) {
				const placeholderStartPos = {line: lineNumber, ch: lastMatch.index};
				const placeholderEndPos = {line: lineNumber, ch: lastMatch.index + lastMatch[0].length};
				this.editor.setSelection(placeholderStartPos, placeholderEndPos);
				return;
			}
		}
	}

	showMathjaxHelperOnCurrentSelection(): void {

		/* eslint-disable */
		const selectedIndex = (this as any).suggestions.selectedItem;
		/* eslint-enable */

		// show the mathjax helper
		this.mathjaxHelper.showHelperBySelectedItemIndex(selectedIndex);

	}
}
