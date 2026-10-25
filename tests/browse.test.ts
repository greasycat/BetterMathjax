import {describe, expect, it} from "vitest";
import {browseSymbols} from "../src/search/browse";
import type {ResolvedSymbol} from "../src/symbols/types";

const make = (name: string, over: Partial<ResolvedSymbol> = {}): ResolvedSymbol => ({
	name, key: name.replace(/^\\/, ""), description: [], examples: [], seeAlso: [], snippet: "",
	preview: true, disabled: false, package: "base", source: "builtin", ...over,
});

const symbols = [
	make("\\,"),
	make("\\to", {description: ["right arrow"]}),
	make("\\alpha"),
	make("\\abs", {source: "user", package: null}),
	make("\\frac", {source: "override"}),
	make("\\textcent", {package: "textcomp", disabled: true}),
	make("\\mapsto", {description: ["Arrow from a point"]}),
];
const names = (list: ResolvedSymbol[]) => list.map((symbol) => symbol.name);

describe("browseSymbols", () => {
	it("sorts by name without a query, letter commands first", () => {
		expect(names(browseSymbols(symbols, {query: "", source: "all", pkg: null})))
			.toEqual(["\\abs", "\\alpha", "\\frac", "\\mapsto", "\\textcent", "\\to", "\\,"]);
	});

	it("puts name matches first, then description matches", () => {
		expect(names(browseSymbols(symbols, {query: "arrow", source: "all", pkg: null}))).toEqual(["\\to", "\\mapsto"]);
		expect(names(browseSymbols(symbols, {query: "\\al", source: "all", pkg: null}))[0]).toBe("\\alpha");
	});

	it("filters by source and package", () => {
		expect(names(browseSymbols(symbols, {query: "", source: "custom", pkg: null}))).toEqual(["\\abs"]);
		expect(names(browseSymbols(symbols, {query: "", source: "customized", pkg: null}))).toEqual(["\\frac"]);
		expect(names(browseSymbols(symbols, {query: "", source: "disabled", pkg: null}))).toEqual(["\\textcent"]);
		expect(names(browseSymbols(symbols, {query: "", source: "all", pkg: "textcomp"}))).toEqual(["\\textcent"]);
		expect(names(browseSymbols(symbols, {query: "", source: "builtin", pkg: "base"}))).toEqual(["\\alpha", "\\mapsto", "\\to", "\\,"]);
	});
});
