import {App, finishRenderMath, Modal, Notice, parseYaml, renderMath, Setting} from "obsidian";
import {BetterMathjaxSettings} from "./settings";
import FuzzySearch from "./fuzzy-search";
import {LATEX_SYMBOLS, MathJaxSymbol} from "./mathjax-symbols";
import Logger from "./logger";


export class MathjaxHelperModal extends Modal {
	private settings: BetterMathjaxSettings;
	private readonly symbol: MathJaxSymbol;

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
				finishRenderMath().then(() => {
				});
				math.style.paddingLeft = "20px";
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

		if (this.settings.userDefinedSymbols == undefined || !(this.settings.userDefinedSymbols instanceof Map)) {
			this.settings.userDefinedSymbols = new Map();
		}

		this.readUserDefinedSymbols().then(() => {
			Logger.instance.info("User defined symbols loaded");
		});
	}

	search(query: string, limit = 5) {
		this.lastQuery = this.fuzzySearch.search(query, limit);
		this.lastQuery = this.maskWithUserDefinedSymbols(this.lastQuery);
		return this.lastQuery;
	}

	maskWithUserDefinedSymbols(symbols: MathJaxSymbol[]): MathJaxSymbol[] {
		//check if the userDefinedSymbols is defined and is a Map

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

	async readUserDefinedSymbols() {
		const file = this.app.vault.getAbstractFileByPath(this.settings.userDefineSymbolFilePath);
		if (file === null) {
			return;
		}

		// check if the file exists
		if (await this.app.vault.adapter.exists(file.path)) {
			// read the file
			this.app.vault.adapter.read(file.path).then((content) => {
				// Regex to match markdown code block and extract both the code type and the content
				const regex = /```(\w+)\n([\s\S]*?)\n```/gm;
				let match;
				while ((match = regex.exec(content)) !== null) {
					const codeType = match[1];
					const codeContent = match[2];
					if (codeType === "yaml") {
						const yaml = parseYaml(codeContent);
						this.loadSymbolArray(yaml);

					}
					else if (codeType == "json") {
						// Load json
						const json = JSON.parse(codeContent);
						this.loadSymbolArray(json);
					}
				}
			});
		}

	}

	loadSymbolArray(array: any[])
	{
		if (Array.isArray(array)) {
			for (const symbol of array) {
				// check if the symbol has a name, a snippet, a description, examples and see_also
				// if not give a default value
				if (!this.isValidSymbol(symbol)) {
					continue;
				}

				// create a new symbol
				const newSymbol: MathJaxSymbol = {
					name: symbol.name,
					snippet: symbol.snippet,
					description: symbol.description,
					examples: symbol.examples,
					see_also: symbol.see_also,
				};
				// Logger.instance.info("new symbol", newSymbol);

				// add to the userDefinedSymbols
				this.settings.userDefinedSymbols.set(newSymbol.name, newSymbol);
			}
		}
	}
	isValidSymbol(symbol: any) {
		if (symbol.name === undefined) {
			return false
		}
		if (symbol.snippet === undefined) {
			symbol.snippet = "";
		}
		if (symbol.description === undefined) {
			symbol.description = "";
		}
		if (symbol.examples === undefined) {
			symbol.examples = [];
		}
		if (symbol.see_also === undefined) {
			symbol.see_also = [];
		}
		return true;
	}
}
