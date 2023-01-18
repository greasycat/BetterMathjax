import {App, finishRenderMath, Modal, Notice, parseYaml, renderMath, Setting, stringifyYaml} from "obsidian";
import {BetterMathjaxSettings} from "./settings";
import MathjaxSearch from "./mathjax-search";
import {LATEX_SYMBOLS, MathJaxSymbol} from "./mathjax-symbols";
import Logger from "./logger";


export class MathjaxHelperModal extends Modal {
	private settings: BetterMathjaxSettings;

	private mathJaxHelper: MathjaxHelper;
	private readonly symbol: MathJaxSymbol;

	constructor(app: App, symbol: MathJaxSymbol, mathJaxHelper: MathjaxHelper ,settings: BetterMathjaxSettings) {
		super(app);
		this.app = app;
		this.symbol = symbol;
		this.settings = settings;
		this.mathJaxHelper = mathJaxHelper;
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
				// if the symbol has never been created, create it
				const newSymbol:MathJaxSymbol =
					{
						name: this.symbol.name,
						snippet: value,
						description: "",
						examples: "",
						see_also: []
					}
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
	private lastQuery: MathJaxSymbol[];

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
		const modal = new MathjaxHelperModal(this.app, this.lastQuery[index], this, this.settings);
		modal.open();
	}

	async readUserDefinedSymbols() {
		const file = this.app.vault.getAbstractFileByPath(this.settings.userDefineSymbolFilePath);
		if (file === null) {
			new Notice("User defined symbols file not found");
			return;
		}

		console.log("Reading user defined symbols");
		// check if the file exists
		if (await this.app.vault.adapter.exists(file.path)) {
			// read the file
			this.app.vault.adapter.read(file.path).then((content) => {
				console.log("User defined symbols file read");
				//clear code blocks
				this.codeBlocks = [];

				//clear user defined symbols
				this.settings.userDefinedSymbols.clear();

				let firstBlockLoaded = false;
				// Regex to match markdown code block and extract both the code type and the content
				const regex = /```(\w+)\n([\s\S]*?)\n```/gm;
				let match;
				while ((match = regex.exec(content)) !== null) {
					const codeType = match[1];
					const codeContent = match[2];
					let json: any;
					try {
						switch (codeType) {
							case "json":
								if (firstBlockLoaded) {
									continue;
								}
								json = JSON.parse(codeContent);
								this.loadSymbolArray(json);
								firstBlockLoaded = true;
								this.codeBlocks.push({content: "", type: codeType});
								break;
							case "yaml":
								if (firstBlockLoaded) {
									continue;
								}
								json = parseYaml(codeContent);
								this.loadSymbolArray(json);
								firstBlockLoaded = true;
								this.codeBlocks.push({content: "", type: codeType});
								break;
							default:
								this.codeBlocks.push({content: codeContent, type: codeType});
								console.log(`Unsupported code block type: ${codeType}`);
								console.log(` ${codeContent}`);
								break;
						}
					}catch (TypeError) {
						console.log(`Error parsing code block type: ${codeType}`);
					}
				}
			});
		}

	}

	async saveUserDefinedSymbols() {
		const file = this.app.vault.getAbstractFileByPath(this.settings.userDefineSymbolFilePath);
		if (file === null) {
			new Notice("User defined symbols file not found");
			return;
		}

		let content = "";
		for (const codeBlock of this.codeBlocks) {
			switch (codeBlock.type) {
				case "json":
					content += "```json\n" + JSON.stringify(Array.from(this.settings.userDefinedSymbols.values()), null, 2) + "\n```\n";
					break;
				case "yaml":
					content += "```yaml\n" + stringifyYaml(Array.from(this.settings.userDefinedSymbols.values())) + "\n```\n";
					break;
				default:
					content += "```"+codeBlock.type+"\n" + codeBlock.content + "\n```\n";
					break;
			}
		}
		await this.app.vault.adapter.write(file.path, content);
	}

	loadSymbolArray(array: any[])
	{
		if (Array.isArray(array)) {
			for (const symbol of array) {
				// check if the symbol has a name, a snippet, a description, examples and see_also
				// if not give a default value
				if (symbol.name === undefined) {
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
				this.fuzzySearch.update(this.settings.userDefinedSymbols);
			}
		}
	}
}
