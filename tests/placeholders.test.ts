import {describe, expect, it} from "vitest";
import {findClosingBracket, findNextPlaceholder, findPreviousClosingBracket, findPreviousPlaceholder, indentSnippet} from "../src/snippet/placeholders";
import {insertionText} from "../src/snippet/insertion";
import type {ResolvedSymbol} from "../src/symbols/types";

const text = "\\frac{@1@}{@2@} + \\sqrt{@10@}";

describe("placeholders", () => {
	it("finds the next placeholder from an offset", () => {
		expect(findNextPlaceholder(text, 0)).toEqual({from: 6, to: 9});
		expect(findNextPlaceholder(text, 9)).toEqual({from: 11, to: 14});
		expect(findNextPlaceholder(text, 15)).toEqual({from: 24, to: 28});
		expect(findNextPlaceholder(text, 28)).toBeNull();
	});

	it("finds the previous placeholder ending before an offset", () => {
		expect(findPreviousPlaceholder(text, 24)).toEqual({from: 11, to: 14});
		expect(findPreviousPlaceholder(text, 11)).toEqual({from: 6, to: 9});
		expect(findPreviousPlaceholder(text, 6)).toBeNull();
	});

	it("steps past the next unescaped closing bracket on the line", () => {
		expect(findClosingBracket("x^{ab} c", 4)).toBe(6);
		expect(findClosingBracket("a\\} b} c", 0)).toBe(6);
		expect(findClosingBracket("f(x) + y", 2)).toBe(4);
		expect(findClosingBracket("[0, 1]", 1)).toBe(6);
		expect(findClosingBracket("a\n}", 0)).toBeNull();
	});

	it("steps back to the previous unescaped closing bracket on the line", () => {
		expect(findPreviousClosingBracket("x^{ab} c", 8)).toBe(5);
		expect(findPreviousClosingBracket("f(x)\\} c", 8)).toBe(3);
		expect(findPreviousClosingBracket("}\nab", 4)).toBeNull();
		expect(findPreviousClosingBracket("x^{ab}", 5)).toBeNull();
	});

	it("carries indentation and blockquote markers into snippet lines", () => {
		expect(indentSnippet("a\n\tb\nc", "> > $$")).toBe("a\n> > \tb\n> > c");
		expect(indentSnippet("a\nb", "    x")).toBe("a\n    b");
		expect(indentSnippet("a\nb", "x")).toBe("a\nb");
	});
});

describe("insertionText", () => {
	const make = (name: string, snippet: string): ResolvedSymbol =>
		({name, key: name.replace(/^\\/, ""), description: [], examples: [], seeAlso: [], snippet, preview: true, disabled: false, package: null, source: "builtin"});

	it("uses the snippet only when preferred", () => {
		expect(insertionText(make("\\frac", "\\frac{@1@}{@2@}"), true)).toEqual({text: "\\frac{@1@}{@2@}", isSnippet: true});
		expect(insertionText(make("\\frac", "\\frac{@1@}{@2@}"), false)).toEqual({text: "\\frac", isSnippet: false});
	});

	it("always expands environments", () => {
		expect(insertionText(make("pmatrix", "\\begin{pmatrix}@1@\\end{pmatrix}"), false).isSnippet).toBe(true);
		expect(insertionText(make("foo", ""), false).text).toBe("\\begin{foo}\n@1@\n\\end{foo}");
	});
});
