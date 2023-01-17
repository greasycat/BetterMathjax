import {App, finishRenderMath, Modal, renderMath, Setting} from "obsidian";
import {BetterMathjaxSettings} from "./settings";
import FuzzySearch from "./fuzzy-search";
import {LATEX_SYMBOLS, MathJaxSymbol} from "./mathjax-symbols";


export class MathjaxHelperModal extends Modal {
	private settings: BetterMathjaxSettings;
	private symbol: MathJaxSymbol;

	constructor(app: App, symbol: MathJaxSymbol, settings: BetterMathjaxSettings) {
		super(app);
		this.app = app;
		this.symbol = symbol;
		this.settings = settings;
	}

	onOpen() {
		const {contentEl} = this;

		// Show symbol name
		contentEl.createEl("h2", {text: this.symbol.name});

		//show symbol description
		// check if the description is a string or string[]
		if (typeof this.symbol.description === "string") {
			contentEl.createEl("p", {text: this.symbol.description});
		} else {
			for (const description of this.symbol.description) {
				contentEl.createEl("p", {text: description});
			}
		}

		// Show symbol examples
		if (this.symbol.examples.length > 0) {
			contentEl.createEl("h4", {text: "Examples"});
			for (const example of this.symbol.examples) {
				const p = contentEl.createEl("p", {text: example});
				const math = renderMath(example, false);
				finishRenderMath().then(() => {});
				p.appendChild(math);
			}
		}

		// Show symbol snippet to edit
		contentEl.createEl("h4", {text: "Snippet"});
		new Setting(contentEl).setName("Snippet").addTextArea((text) => {
			text.setValue(this.symbol.snippet);
			text.onChange((value) => {
				// copy the symbol
				const newSymbol = {...this.symbol};
				newSymbol.snippet = value;
				// if the symbol has never been created, create it
				if (this.settings.userDefinedSymbols.get(this.symbol.name) === undefined) {
					this.settings.userDefinedSymbols.set(this.symbol.name, newSymbol);
				}
				// if the symbol has been created, update it
				else {
					this.settings.userDefinedSymbols.set(this.symbol.name, newSymbol);
				}
			});
		});




	}

	onClose() {
		this.contentEl.empty();
	}


}

export class MathjaxHelper {
	private readonly app: App;
	private readonly settings: BetterMathjaxSettings;
	private fuzzySearch: FuzzySearch;
	private lastQuery: MathJaxSymbol[];

	constructor(app: App, settings: BetterMathjaxSettings) {
		this.app = app;
		this.settings = settings;
		this.fuzzySearch = new FuzzySearch();
		this.fuzzySearch.load(LATEX_SYMBOLS);
	}

	search(query: string, limit = 5) {
		this.lastQuery = this.fuzzySearch.search(query, limit);
		this.lastQuery = this.maskWithUserDefinedSymbols(this.lastQuery);
		return this.lastQuery;
	}

	maskWithUserDefinedSymbols(symbols: MathJaxSymbol[]): MathJaxSymbol[] {
		// If the user has defined a symbol, use it instead of the default one
		for (const symbol of symbols) {
			const userDefinedSymbol = this.settings.userDefinedSymbols.get(symbol.name);
			if (userDefinedSymbol !== undefined) {
				symbol.snippet = userDefinedSymbol.snippet;
			}
		}
		return symbols;
	}

	showHelperBySelectedItemIndex(index: number) {
		const modal = new MathjaxHelperModal(this.app, this.lastQuery[index], this.settings);
		modal.open();
	}


}
