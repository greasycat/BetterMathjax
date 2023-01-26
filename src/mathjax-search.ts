import PriorityQueue from './priority-queue';
import {dld} from './fuzzy-search-dld';
import FuzzySearch from "./fuzzy-search-lcs";

// eslint-disable-next-line @typescript-eslint/no-var-requires
import {MathJaxSymbol} from './mathjax-symbols';
import {BetterMathjaxSettings} from "./settings";
import Logger from "./logger";

type QueueItem = {
	item: string,
	distance: number,

}

export type FuzzySearchType = "LCS" | "DLD";

export default class MathjaxSearch {
	private data: Map<string, MathJaxSymbol>;
	private readonly settings: BetterMathjaxSettings;

	constructor(settings: BetterMathjaxSettings) {
		this.data = new Map();
		this.settings = settings;
	}


	load(data: MathJaxSymbol[]) {
		this.data = new Map(data.map((item) => [item.name, item]));
		Logger.instance.log("Loaded Mathjax Symbols", this.data.size);
	}

	update(newData: Map<string, MathJaxSymbol>) {
		// iterate over newData if the symbol has been created, update it
		// else add it to the map
		newData.forEach((newSymbol, key) => {
			if (this.data.has(key)) {
				const oldSymbol = this.data.get(key);
				this.data.set(key, {...oldSymbol, ...newSymbol});
			} else {
				this.data.set(key, newSymbol);
			}
		});
	}

	search(query: string, limit = 5) {
		switch (this.settings.fuzzySearchType) {
			case "DLD":
				return this.searchDld(query, limit);
			case "LCS":
				return this.searchLcs(query, limit);
			default:
				return this.searchLcs(query, limit);
		}
	}

	searchDld(query: string, limit = 5) {
		const queue = new PriorityQueue((a: QueueItem, b: QueueItem) => a.distance > b.distance);
		this.data.forEach((item) => {
			// remove the first backslash in item.name using regex

			queue.push({
				item,
				// distance: distanceRatio(query, item.name.replace(/\\/, ''))
				distance: dld(query, item.name)
			});
		});
		const result: MathJaxSymbol[] = [];
		while (!queue.isEmpty() && limit > 0) {
			const symbol: MathJaxSymbol = queue.pop().item;
			// symbol.name = symbol.name.replace(/\\/, '');
			result.push(symbol);
			limit--;
		}
		return result;
	}

	searchLcs(query: string, limit = 5) {

		// convert values into array
		const values = Array.from(this.data.values());
		const searcher = new FuzzySearch({source: values, keys: ['name'], output_limit: limit});
		//@ts-ignore
		return searcher.search(query);
	}
}
