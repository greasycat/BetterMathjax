import {describe, expect, it} from "vitest";
import builtin from "../src/symbols/builtin-symbols.json";
import {SymbolRegistry} from "../src/symbols/registry";
import {rank, score} from "../src/search/ranker";
import type {SymbolEntry} from "../src/symbols/types";

const registry = new SymbolRegistry(builtin as SymbolEntry[]);
const top = (query: string, limit = 5) => rank(registry.all(), query, limit).map((s) => s.name);

describe("score", () => {
	it("orders match tiers", () => {
		const exact = score("alpha", "alpha")!;
		const prefix = score("alp", "alpha")!;
		const caseless = score("Alp", "alpha")!;
		const substring = score("pha", "alpha")!;
		const subsequence = score("aph", "alpha")!;
		expect(exact).toBeGreaterThan(prefix);
		expect(prefix).toBeGreaterThan(caseless);
		expect(caseless).toBeGreaterThan(substring);
		expect(substring).toBeGreaterThan(subsequence);
		expect(score("xyz", "alpha")).toBeNull();
	});
});

describe("rank on built-in symbols", () => {
	it("puts the exact command first", () => {
		expect(top("alpha")[0]).toBe("\\alpha");
		expect(top("frac")[0]).toBe("\\frac");
	});

	it("respects case", () => {
		expect(top("Delta")[0]).toBe("\\Delta");
		expect(top("delta")[0]).toBe("\\delta");
	});

	it("finds environments by name", () => {
		expect(top("pmat", 2).sort()).toEqual(["\\pmatrix", "pmatrix"]);
	});

	it("returns at most the limit", () => {
		expect(top("a", 3)).toHaveLength(3);
	});
});

describe("SymbolRegistry", () => {
	it("merges user overrides field by field and adds new symbols", () => {
		const reg = new SymbolRegistry(builtin as SymbolEntry[]);
		const before = reg.get("\\int")!;
		expect(before.description.length).toBeGreaterThan(0);
		reg.setUserEntries([
			{name: "\\int", snippet: "\\int_{@1@}^{@2@}", description: ""},
			{name: "\\R", snippet: "\\mathbb{R}"},
		]);
		const int = reg.get("\\int")!;
		expect(int.snippet).toBe("\\int_{@1@}^{@2@}");
		expect(int.description).toEqual(before.description);
		expect(int.source).toBe("override");
		expect(reg.get("\\R")!.source).toBe("user");

		reg.setUserEntries([{name: "\\int", disabled: true}, {name: "\\R", snippet: "x", disabled: true}]);
		expect(reg.get("\\int")!.disabled).toBe(true);
		expect(reg.get("\\int")!.source).toBe("builtin");
		expect(reg.get("\\int")!.snippet).toBe(before.snippet);
		expect(reg.enabled().some((symbol) => symbol.name === "\\int" || symbol.name === "\\R")).toBe(false);
		expect(reg.all().some((symbol) => symbol.name === "\\int")).toBe(true);
		expect(reg.packages()).toContain("mathtools");

		reg.setUserEntries([]);
		expect(reg.get("\\int")!.snippet).toBe(before.snippet);
		expect(reg.get("\\R")).toBeUndefined();
	});
});
