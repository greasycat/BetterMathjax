import PriorityQueue from './priority-queue';
import {distanceRatio} from './edit-distance';
import {MathJaxSymbol} from './mathjax-symbols';

type QueueItem = {
	item: string,
	distance: number,

}
export default class FuzzySearch {
	private _data: MathJaxSymbol[];

	constructor() {
		this._data = [];
	}


	load(data: MathJaxSymbol[]) {
		this._data = data;
	}

	concat(extra: []) {
		this._data = this._data.concat(extra);
	}

	update(item: MathJaxSymbol) {
		const index = this._data.findIndex((i) => i.name === item.name);
		if (index !== -1) {
			this._data[index] = item;
		}
	}

	search(query: string, limit = 5) {
		const queue = new PriorityQueue((a: QueueItem, b: QueueItem) => a.distance > b.distance);
		this._data.forEach((item) => {
			// remove the first backslash in item.name using regex

			queue.push({
				item,
				// distance: distanceRatio(query, item.name.replace(/\\/, ''))
				distance: distanceRatio(query, item.name)
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
}
