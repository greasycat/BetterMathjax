import {App, finishRenderMath, Modal, Notice, parseYaml, renderMath, Setting, stringifyYaml, TFile} from "obsidian";
import {BetterMathjaxSettings} from "./settings";
import MathjaxSearch, {getSymbolFromQuery, MathJaxSymbolQuery} from "./mathjax-search";
import {LATEX_SYMBOLS, MathJaxSymbol} from "./mathjax-symbols";
import Logger from "./logger";


export class MathjaxHelperModal extends Modal {
	private settings: BetterMathjaxSettings;

	private mathJaxHelper: MathjaxHelper;
	private readonly symbolPair: MathJaxSymbolQuery;

	constructor(app: App, symbolPair: MathJaxSymbolQuery, mathJaxHelper: MathjaxHelper, settings: BetterMathjaxSettings) {
		super(app);
		this.app = app;
		this.symbolPair = symbolPair;
		this.settings = settings;
		this.mathJaxHelper = mathJaxHelper;
	}

	onOpen() {
		const {contentEl} = this;

		const symbol = getSymbolFromQuery(this.symbolPair);
		Logger.instance.info("Symbol: " + symbol);

		// Show symbol name
		contentEl.createEl("h2", {text: symbol.name});

		//show symbol description
		// check if the description is a string or string[]
		Logger.instance.info("description: ");
		if (String.isString(symbol.description)) {
			contentEl.createEl("p", {text: symbol.description});
		} else if (Array.isArray(symbol.description)) {
			for (const description of symbol.description) {
				contentEl.createEl("p", {text: description});
			}
		}


		if (Array.isArray(symbol.examples) && symbol.examples.length > 0) {
			contentEl.createEl("h4", {text: "Examples"});
			for (const example of symbol.examples) {
				const p = contentEl.createEl("p", {text: example});
				const math = renderMath(example, false);
				finishRenderMath().then(() => {
				});
				p.addClass("better-mathjax-helper-example-entry")
				p.appendChild(math);
			}
		}

		// Show see_also
		if (Array.isArray(symbol.see_also) && symbol.see_also.length > 0) {
			const seeAlsoTitle = contentEl.createEl("h4", {text: "See also"});
			seeAlsoTitle.addClass("better-mathjax-helper-see-also-title");
			for (const see_also of symbol.see_also) {
				const p = contentEl.createEl("p", {text: see_also});
				p.addClass("better-mathjax-helper-see-also-entry");
			}
		}

		// Show symbol snippet to edit
		contentEl.createEl("h4", {text: "Your Snippet"});
		new Setting(contentEl).setName("Content").addTextArea((text) => {
			text.setValue(symbol.snippet);
			text.onChange((value) => {
				// copy the symbol
				// if the symbol has never been created, create it
				const newSymbol: MathJaxSymbol =
					{
						name: symbol.name,
						snippet: value,
						description: "",
						examples: "",
						see_also: []
					};
				if (this.settings.userDefinedSymbols.get(symbol.name) === undefined) {

					this.settings.userDefinedSymbols.set(symbol.name, newSymbol);
				}
				// if the symbol has been created, update it
				else {
					this.settings.userDefinedSymbols.set(symbol.name, newSymbol);
				}
			});
		});


	}

	onClose() {
		this.contentEl.empty();
		this.mathJaxHelper.saveUserDefinedSymbols().then(() => {
			new Notice("User defined symbols saved");
		});
	}


}

type CodeBlock = {
	content: string;
	type: string;
}

export class MathjaxHelper {
	private readonly app: App;
	private readonly settings: BetterMathjaxSettings;
	private fuzzySearch: MathjaxSearch;
	private lastQuery: MathJaxSymbolQuery[];

	private codeBlocks: CodeBlock[];

	constructor(app: App, settings: BetterMathjaxSettings) {
		this.app = app;
		this.settings = settings;
		//json and unjson the fuzzy search type from the settings

		this.fuzzySearch = new MathjaxSearch(settings);
		this.fuzzySearch.load(LATEX_SYMBOLS);

		if (this.settings.userDefinedSymbols == undefined || !(this.settings.userDefinedSymbols instanceof Map)) {
			this.settings.userDefinedSymbols = new Map();
		}

		this.readUserDefinedSymbols().then((status) => {
			Logger.instance.info("User Defined Symbols Loading:", status);
		});
	}

	search(query: string, limit = 5) {
		this.lastQuery = this.fuzzySearch.search(query, limit);
		return this.lastQuery;
	}

	showHelperBySelectedItemIndex(index: number) {
		const modal = new MathjaxHelperModal(this.app, this.lastQuery[index], this, this.settings);
		modal.open();
	}

	async readUserDefinedSymbols(): Promise<boolean> {
		const file = this.app.vault.getAbstractFileByPath(this.settings.userDefineSymbolFilePath);
		// check if the file exists
		if (file instanceof TFile) {
			// read the file
			const content = await this.app.vault.cachedRead(file);

			//clear code blocks
			this.codeBlocks = [];

			//clear user defined symbols
			this.settings.userDefinedSymbols.clear();

			let firstBlockLoaded = false;
			// Regex to match Markdown code block and extract both the code type and the content
			const regex = /```(\w+)\n([\s\S]*?)\n```/gm;
			let match;
			while ((match = regex.exec(content)) !== null) {
				const codeType = match[1];
				const codeContent = match[2];
				let json: any;
				try {
					if (codeType === "json" || codeType === "yaml") {
						if (firstBlockLoaded) {
							continue;
						}
						json = codeType === "json" ? JSON.parse(codeContent) : parseYaml(codeContent);
						this.loadSymbolArray(json);
						firstBlockLoaded = true;
						this.codeBlocks.push({content: "", type: codeType});
					} else {
						this.codeBlocks.push({content: codeContent, type: codeType});
					}
				} catch (TypeError) {
					Logger.instance.error(`Unsupported code block type: ${codeType}`);
					return false;
				}
			}
			return true;
		} else {
			new Notice("User defined symbols file not found");
			Logger.instance.error("User defined symbols file not found");
			// return an error
			return false;
		}
	}

	async saveUserDefinedSymbols() {
		const file = this.app.vault.getAbstractFileByPath(this.settings.userDefineSymbolFilePath);
		if (file === null) {
			new Notice("User defined symbols file not found");
			Logger.instance.error("User defined symbols file not found");
			return;
		}

		let content = "";
		if (this.codeBlocks.length === 0) {
			this.codeBlocks.push({content: "", type: "json"});
		}
		for (const codeBlock of this.codeBlocks) {
			switch (codeBlock.type) {
				case "json":
					content += "```json\n" + JSON.stringify(Array.from(this.settings.userDefinedSymbols.values()), null, 2) + "\n```\n";
					break;
				case "yaml":
					content += "```yaml\n" + stringifyYaml(Array.from(this.settings.userDefinedSymbols.values())) + "\n```\n";
					break;
				default:
					content += "```" + codeBlock.type + "\n" + codeBlock.content + "\n```\n";
					break;
			}
		}

		await this.app.vault.modify(file as TFile, content);
	}

	loadSymbolArray(array: any[]) {
		if (Array.isArray(array)) {
			for (const symbol of array) {
				// check if the symbol has a name, a snippet, a description, examples and see_also
				// if not give a default value
				if (symbol.name === undefined || symbol.name === "") {
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

				// add to the userDefinedSymbols
				this.settings.userDefinedSymbols.set(newSymbol.name, newSymbol);
				this.fuzzySearch.update(this.settings.userDefinedSymbols);

				Logger.instance.info("New symbol loaded: ", newSymbol.name);
			}
		}
	}
}
