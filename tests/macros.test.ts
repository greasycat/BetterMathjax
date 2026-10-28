import {EditorState} from "@codemirror/state";
import {describe, expect, it} from "vitest";
import {renderError} from "../scripts/mathjax-node.mjs";
import {documentMacrosField, macrosInState} from "../src/editor/document-macros";
import {scanMath} from "../src/math/context";
import {parseMacros} from "../src/math/macros";
import {documentSymbols, withDocumentSymbols} from "../src/symbols/document-symbols";
import type {ResolvedSymbol} from "../src/symbols/types";

const parse = (text: string) => parseMacros(text, scanMath(text).regions);
const brief = (text: string) => parse(text).map(({kind, name, args, optional, body}) => ({kind, name, args, optional, body}));

describe("parseMacros", () => {
	it("reads the forms of \\newcommand", () => {
		expect(brief("$\\newcommand{\\R}{\\mathbb{R}}$")).toEqual([{kind: "command", name: "\\R", args: 0, optional: null, body: "\\mathbb{R}"}]);
		expect(brief("$$\\renewcommand\\norm[1]{\\lVert #1 \\rVert}$$")[0]).toMatchObject({name: "\\norm", args: 1});
		expect(brief("$\\providecommand*{\\pair}[2][x]{(#1,#2)}$")[0]).toMatchObject({name: "\\pair", args: 2, optional: "x"});
		expect(brief("$\\newcommand{\\half}{\\frac{1}{2}}$")[0]!.body).toBe("\\frac{1}{2}");
	});

	it("reads \\def, \\let, \\DeclareMathOperator and \\newenvironment", () => {
		expect(brief("$\\def\\ip#1#2{\\langle #1, #2\\rangle}$")[0]).toMatchObject({name: "\\ip", args: 2});
		expect(brief("$\\let\\eps=\\varepsilon$")[0]).toMatchObject({kind: "let", name: "\\eps", body: "\\varepsilon"});
		expect(brief("$\\DeclareMathOperator*{\\argmax}{arg\\,max}$")[0]).toMatchObject({name: "\\argmax", body: "\\operatorname*{arg\\,max}"});
		expect(brief("$$\\newenvironment{bmat}[1]{\\left[\\begin{array}{#1}}{\\end{array}\\right]}$$")[0])
			.toMatchObject({kind: "environment", name: "bmat", args: 1, body: "\\left[\\begin{array}{#1}"});
	});

	it("finds several definitions in one block and keeps the source of each", () => {
		const text = "$$\n\\newcommand{\\R}{\\mathbb{R}}\n\\newcommand{\\N}{\\mathbb{N}}\nx\\in\\R\n$$";
		const defs = parse(text);
		expect(defs.map((def) => def.name)).toEqual(["\\R", "\\N"]);
		expect(text.slice(defs[1]!.from, defs[1]!.to)).toBe("\\newcommand{\\N}{\\mathbb{N}}");
	});

	it("ignores definitions outside math, in code and after \\\\", () => {
		expect(parse("\\newcommand{\\R}{\\mathbb{R}}")).toEqual([]);
		expect(parse("```\n$\\newcommand{\\R}{R}$\n```")).toEqual([]);
		expect(parse("`$\\newcommand{\\R}{R}$`")).toEqual([]);
		expect(parse("$$a\\\\newcommand{\\R}{R}$$")).toEqual([]);
	});

	it("skips definitions that do not parse", () => {
		expect(parse("$\\newcommand{\\R}{\\mathbb{R}$")).toEqual([]);
		expect(parse("$\\newcommand{\\R}[x]{R}$")).toEqual([]);
		expect(parse("$\\newcommand{R}{R}$")).toEqual([]);
		expect(parse("$\\newcommand$ $\\newcommand{\\S}{S}$").map((def) => def.name)).toEqual(["\\S"]);
	});
});

const lookup = (name: string): ResolvedSymbol | undefined => name === "\\varepsilon"
	? {name, key: "varepsilon", description: ["Epsilon."], examples: [], seeAlso: [], snippet: "", preview: true, disabled: false, package: null, source: "builtin"}
	: undefined;
const symbolsOf = (text: string) => documentSymbols(parse(text), () => 1, lookup);

describe("documentSymbols", () => {
	it("makes snippets for the required arguments", () => {
		const [norm, pair, R] = symbolsOf("$\\newcommand{\\norm}[1]{|#1|}\\newcommand{\\pair}[2][0]{(#1,#2)}\\newcommand{\\R}{R}$");
		expect(norm).toMatchObject({name: "\\norm", key: "norm", snippet: "\\norm{@1@}", source: "document"});
		expect(pair!.snippet).toBe("\\pair{@1@}");
		expect(R!.snippet).toBe("");
	});

	it("makes environment snippets", () => {
		const [env] = symbolsOf("$\\newenvironment{bmat}[1]{\\left[\\begin{array}{#1}}{\\end{array}\\right]}$");
		expect(env).toMatchObject({name: "bmat", key: "bmat", snippet: "\\begin{bmat}{@1@}\n\t@2@\n\\end{bmat}"});
	});

	it("uses the last definition of a name and copies what \\let points to", () => {
		const symbols = symbolsOf("$\\newcommand{\\R}{A}\\renewcommand{\\R}{B}\\let\\eps\\varepsilon$");
		expect(symbols.map((symbol) => symbol.name)).toEqual(["\\R", "\\eps"]);
		expect(symbols[0]!.description[1]).toContain("{B}");
		expect(symbols[1]!.description).toContain("Epsilon.");
	});

	it("renders every preview with the note's definitions in front", async () => {
		const text = "$$\\newcommand{\\R}{\\mathbb{R}}\\newcommand{\\norm}[1]{\\lVert #1\\rVert}\\newcommand{\\pair}[2][0]{(#1,#2)}" +
			"\\def\\ip#1#2{\\langle #1,#2\\rangle}\\DeclareMathOperator*{\\argmax}{arg\\,max}\\let\\eps\\varepsilon" +
			"\\newcommand{\\Rn}{\\R^n}\\newenvironment{bmat}[1]{\\left[\\begin{array}{#1}}{\\end{array}\\right]}" +
			"\\renewcommand{\\vec}[1]{\\mathbf{#1}}$$";
		const failures: string[] = [];
		for (const symbol of symbolsOf(text)) {
			const error = await renderError(symbol.preamble! + symbol.examples[0]!);
			if (error) failures.push(`${symbol.name}: ${error}`);
		}
		expect(failures).toEqual([]);
	});

	it("puts the note's symbols first and drops the others of the same name", () => {
		const note = symbolsOf("$\\newcommand{\\R}{R}$");
		const others = [{...lookup("\\varepsilon")!}, {...lookup("\\varepsilon")!, name: "\\R", key: "R"}];
		expect(withDocumentSymbols(note, others).map((symbol) => [symbol.name, symbol.source]))
			.toEqual([["\\R", "document"], ["\\varepsilon", "builtin"]]);
		expect(withDocumentSymbols([], others)).toBe(others);
	});
});

describe("documentMacrosField", () => {
	const create = (doc: string) => EditorState.create({doc, extensions: documentMacrosField});
	const names = (state: EditorState) => macrosInState(state).defs.map((def) => def.name);

	it("keeps the definitions and their positions while typing elsewhere", () => {
		let state = create("$$\\newcommand{\\R}{R}$$\n\n$x$");
		const before = macrosInState(state).defs;
		state = state.update({changes: {from: 0, insert: "Intro\n"}}).state;
		const {defs, line} = macrosInState(state);
		expect(defs).not.toBe(before);
		expect(state.sliceDoc(defs[0]!.from, defs[0]!.to)).toBe("\\newcommand{\\R}{R}");
		expect(line(defs[0]!)).toBe(2);

		state = state.update({changes: {from: state.doc.length - 1, insert: "+y"}}).state;
		expect(state.sliceDoc(macrosInState(state).defs[0]!.from, macrosInState(state).defs[0]!.to)).toBe("\\newcommand{\\R}{R}");
	});

	it("parses again after an edit to a definition or a new definer", () => {
		let state = create("$$\\newcommand{\\R}{R}$$\n\n$x$");
		expect(names(state)).toEqual(["\\R"]);
		state = state.update({changes: {from: 15, to: 16, insert: "S"}}).state;
		expect(names(state)).toEqual(["\\S"]);
		const end = state.doc.length - 1;
		state = state.update({changes: {from: end, insert: "\\def\\T{T}"}}).state;
		expect(names(state)).toEqual(["\\S", "\\T"]);
		state = state.update({changes: {from: 0, to: 22}}).state;
		expect(names(state)).toEqual(["\\T"]);
	});

	it("matches a full parse after random edits inside one math block", () => {
		let seed = 7;
		const next = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
		// Edits stay between the delimiters: moving a delimiter is the documented case the field does not track.
		const pieces = ["\\newcommand{\\A}{a}", "\\newcommand", "\\def\\B{b}", "x", " ", "\n", "{", "}", "\\R", "[1]", "#1"];
		let state = create("$$\n\\newcommand{\\R}{R}\n$$");
		for (let i = 0; i < 1000; i++) {
			const inner = state.doc.length - 6;
			const from = 3 + Math.floor(next() * (inner + 1));
			const to = next() < 0.3 ? Math.min(3 + inner, from + Math.floor(next() * 6)) : from;
			state = state.update({changes: {from, to, insert: next() < 0.8 ? pieces[Math.floor(next() * pieces.length)]! : ""}}).state;
			if (i % 4 === 0) {
				const text = state.doc.toString();
				expect(macrosInState(state).defs.map((def) => [def.name, def.from]))
					.toEqual(parse(text).map((def) => [def.name, def.from]));
			}
		}
	});
});
