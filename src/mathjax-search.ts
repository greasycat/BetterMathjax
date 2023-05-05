import PriorityQueue from './priority-queue';

import {dld} from './fuzzy-search-dld';
// @ts-ignore
import FuzzySearch from 'fz-search';

// eslint-disable-next-line @typescript-eslint/no-var-requires
import {MathJaxSymbol} from './mathjax-symbols';
import {BetterMathjaxSettings} from "./settings";
import Logger from "./logger";

type QueueItem = {
	item: string,
	distance: number,

}

export type FuzzySearchType = "LCS" | "DLD";

export type MathJaxSymbolQuery = {
	name: string,
	originalSymbol: MathJaxSymbol | null,
	userSymbol: MathJaxSymbol | null,
}

export function getSymbolFromQuery(pair: MathJaxSymbolQuery): MathJaxSymbol {
	const newSymbol: MathJaxSymbol = JSON.parse(JSON.stringify(pair.originalSymbol));
	if (newSymbol == null) {
		if (pair.userSymbol == null) {
			throw new Error("Both symbols are null");
		}
		return pair.userSymbol;
	}
	if (pair.userSymbol) {
		// check if the user symbol has an empty description, if so use the original symbol's description
		if (pair.userSymbol.description !== "") {
			newSymbol.description = pair.userSymbol.description;
		}
		// check for examples list
		if ((String.isString(pair.userSymbol.examples) && pair.userSymbol.examples !== "") || (Array.isArray(pair.userSymbol.examples) && pair.userSymbol.examples.length > 0)) {
			newSymbol.examples = pair.userSymbol.examples;
		}
		// check for see_also list
		if (Array.isArray(pair.userSymbol.see_also) && pair.userSymbol.see_also.length > 0) {
			newSymbol.see_also = pair.userSymbol.see_also;
		}

		// check for snippet
		if (pair.userSymbol.snippet !== "") {
			newSymbol.snippet = pair.userSymbol.snippet;
		}
	}
	return newSymbol;
}

export default class MathjaxSearch {
	private data: Map<string, MathJaxSymbolQuery>;
	private readonly settings: BetterMathjaxSettings;

	constructor(settings: BetterMathjaxSettings) {
		this.data = new Map();
		this.settings = settings;
	}


	load(data: MathJaxSymbol[]) {
		this.data = new Map(data.map((item) => [item.name, {name:item.name, originalSymbol: item, userSymbol: null}]));
		Logger.instance.info("Loaded Mathjax symbols. Size: ", this.data.size);
	}

	update(newData: Map<string, MathJaxSymbol>) {
		// iterate over newData if the symbol has been created, update it
		// else add it to the map
		newData.forEach((newSymbol, key) => {
			if (this.data.has(key)) {
				const symbolQuery = this.data.get(key);
				if (symbolQuery) {
					symbolQuery.userSymbol = newSymbol;
				}
			} else {
				this.data.set(key, {name: key, originalSymbol: null, userSymbol: newSymbol});
			}
		});
	}

	search(query: string, limit = 5): MathJaxSymbolQuery[] {
		switch (this.settings.fuzzySearchType) {
			case "DLD":
				return this.searchDld(query, limit);
			case "LCS":
				return this.searchLcs(query, limit);
			default:
				return this.searchLcs(query, limit);
		}
	}

	searchDld(query: string, limit = 5): MathJaxSymbolQuery[] {
		const queue = new PriorityQueue((a: QueueItem, b: QueueItem) => a.distance > b.distance);
		this.data.forEach((item) => {
			// remove the first backslash in item.name using regex
			queue.push({
				item,
				distance: dld(query, item.name)
			});
		});
		const result: MathJaxSymbolQuery[] = [];
		while (!queue.isEmpty() && limit > 0) {
			const symbol: MathJaxSymbolQuery = queue.pop().item;
			// symbol.name = symbol.name.replace(/\\/, '');
			result.push(symbol);
			limit--;
		}
		return result;
	}

	searchLcs(query: string, limit = 5): MathJaxSymbolQuery[] {

		// convert values into array
		const values = Array.from(this.data.values());

		// set normalize to return the string as is so the query is case-sensitive
		const searcher = new FuzzySearch({source: values, keys: ['name'], output_limit: limit, normalize: (string: string)=>{return string}});

		//@ts-ignore
		return searcher.search(query);
	}
}
