// Rebuild src/symbols/builtin-symbols.json:
//  1. clean the hand-written entries (scrape noise in descriptions, examples that do not render),
//  2. add every command and environment the MathJax shipped with Obsidian knows but the table lacks,
//  3. give commands that take arguments a snippet, and give every entry a preview that renders.
// Run with `npm run build:registry`; `npm test` then checks that everything renders.
import {readFileSync, writeFileSync} from "node:fs";
import {initMathJax, OBSIDIAN_TEX_PACKAGES, renderError} from "./mathjax-node.mjs";

const PATH = new URL("../src/symbols/builtin-symbols.json", import.meta.url);
const PLACEHOLDER = /@\d+@/g;

const mj = await initMathJax();
const curated = JSON.parse(readFileSync(PATH, "utf8"));

/** name -> {kind, pkg} for everything the TeX input knows, from MathJax's own tables. */
function catalog() {
	const tex = mj._.input.tex;
	const handlers = tex.Configuration.ConfigurationHandler;
	const maps = tex.MapHandler.MapHandler;
	const found = new Map();
	for (const pkg of OBSIDIAN_TEX_PACKAGES) {
		const handler = handlers.get(pkg)?.handler ?? {};
		for (const kind of Object.keys(handler)) {
			for (const mapName of handler[kind]) {
				const map = maps.getMap(mapName);
				const inner = map?.map ?? map?._map;
				if (!(inner instanceof Map)) continue;
				for (const key of inner.keys()) {
					let name = null;
					if (kind === "environment") name = key;
					else if (kind === "delimiter") name = key.startsWith("\\") && /^\\[A-Za-z]+$/.test(key) ? key : null;
					else if (/^[A-Za-z]+$/.test(key)) name = `\\${key}`;
					if (name && !found.has(name)) found.set(name, {kind, pkg});
				}
			}
		}
	}
	if (found.size < 1000) throw new Error(`Only ${found.size} commands found in MathJax's tables; the internals may have changed.`);
	return found;
}

function cleanDescription(text) {
	if (text === undefined) return undefined;
	const raw = Array.isArray(text) ? text.join("\n\n") : text;
	const lines = raw
		.replace(/ /g, " ")
		// "&#x03B1;   class ORD" and similar MathJax-internal notes from the scraped reference: a line of its own,
		// or a symbol code followed by the class. "an item of class REL" in a sentence is prose and stays.
		.replace(/^[ \t]*(&#x?[0-9a-f]+;)?[ \t]*class (ORD|BIN|REL|OP|OPEN|CLOSE|PUNCT|INNER)[ \t]*$/gim, "")
		.replace(/&#x?[0-9a-f]+;[ \t]*class (ORD|BIN|REL|OP|OPEN|CLOSE|PUNCT|INNER)[ \t]*$/gim, "")
		.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
		.replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
		.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
		.split("\n")
		.map((line) => line.replace(/[ \t]+/g, " ").trim())
		// A symbol on a line of its own is the glyph the scraped page showed next to the description.
		.filter((line) => !(line.length > 0 && line.length <= 2 && !/[A-Za-z0-9]/.test(line)))
		.map((line) => {
			// Usage lines such as "\frac #1 #2" or "\pmatrix{ <math> & … }" read better, and render literally, as code.
			if (line.includes("`")) return line;
			if (/^\\[A-Za-z]+.*(#\d|<)/.test(line)) return `\`${line}\``;
			// Elsewhere "<math>" would be read as an HTML tag by the Markdown renderer.
			return line.replace(/(?<!\\)</g, "\\<");
		});
	const joined = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
	return joined === "" ? undefined : joined;
}

const FILLS = ["x", "c", "2", "1em", "align"];

/** The snippet with its placeholders filled so that it renders, or null. */
async function renderableFill(snippet) {
	for (const fill of FILLS) {
		const filled = snippet.replace(PLACEHOLDER, fill);
		if (!(await renderError(filled))) return filled;
	}
	return null;
}

/** For a command whose bare form fails, the smallest `{@1@}…` snippet that renders, or null. */
async function argumentSnippet(name) {
	for (const args of ["{@1@}", "{@1@}{@2@}", "{@1@}{@2@}{@3@}", "[@1@]{@2@}"]) {
		const snippet = name + args;
		if (await renderableFill(snippet)) return snippet;
	}
	return null;
}

let unique = 0;
/** A macro name no earlier render has defined: MathJax keeps definitions for the whole session. */
function freshMacro() {
	let n = unique++;
	let letters = "";
	do {
		letters = String.fromCharCode(97 + (n % 26)) + letters;
		n = Math.floor(n / 26) - 1;
	} while (n >= 0);
	return `\\bmj${letters}`;
}

/**
 * Commands that define or configure something (macros, labels, settings). Rendering them in a preview would
 * define it in the user's MathJax for the whole session, and a second render can fail with "already defined". So they get no
 * rendered example; their usage goes into the description instead.
 */
const DEFINING = /^\\(label|def|let|gdef|edef|xdef|newcommand|renewcommand|newenvironment|renewenvironment|DeclareMathOperator|DeclarePairedDelimiter\w*|Newextarrow|MakeAboxedCommand|mathtoolsset|definecolor|require|newtagform|usetagform|setOptions|CDsetup)$/;

/** Hand-written usage for the defining commands, shown as code in their description. */
const USAGE = {
	"\\def": "\\def\\foo{x}\\foo",
	"\\let": "\\let\\foo=x\\foo",
	"\\newcommand": "\\newcommand{\\foo}[1]{x^{#1}}\\foo{2}",
	"\\renewcommand": "\\newcommand{\\foo}{x}\\renewcommand{\\foo}{y}\\foo",
	"\\newenvironment": "\\newenvironment{myenv}{\\left[}{\\right]}\\begin{myenv}x\\end{myenv}",
	"\\DeclareMathOperator": "\\DeclareMathOperator{\\sgn}{sgn}\\sgn x",
	"\\DeclarePairedDelimiter": "\\DeclarePairedDelimiter\\abs{\\lvert}{\\rvert}\\abs{x}",
	"\\DeclarePairedDelimiterX": "\\DeclarePairedDelimiterX\\set[1]{\\{}{\\}}{#1}\\set{x}",
	"\\DeclarePairedDelimiterXPP": "\\DeclarePairedDelimiterXPP\\abs[1]{}{\\lvert}{\\rvert}{}{#1}\\abs{x}",
	"\\definecolor": "\\definecolor{mycolor}{RGB}{255,0,0}\\color{mycolor}{x}",
	"\\Newextarrow": "\\Newextarrow{\\xmyarrow}{5,5}{0x2192}\\xmyarrow{x}",
	"\\MakeAboxedCommand": "\\MakeAboxedCommand\\boxit\\boxit{x}",
	"\\require": "\\require{cancel}\\cancel{x}",
	"\\label": "\\begin{equation}E=mc^2\\label{energy}\\end{equation}",
};

/** Forms worth trying as a preview for commands that do not render on their own. */
function previewTemplates(name) {
	if (name === "\\begin" || name === "\\end") return ["\\begin{matrix}a & b\\end{matrix}"];
	if (name === ".") return ["\\left. x \\right|"];
	if (name === "=") return ["\\={a}", "a = b"];
	if (name === "\\root") return ["\\root 3 \\of x"];
	if (name === "\\rule") return ["\\rule{1em}{1em}"];
	if (name === "\\toggle") return ["\\toggle{a}{b}\\endtoggle"];
	if (name === "\\mmlToken") return ["\\mmlToken{mi}{x}"];
	if (name === "\\Newextarrow") return ["\\Newextarrow{\\xmyarrow}{5,5}{0x2192}\\xmyarrow{x}"];
	if (name === "\\DeclarePairedDelimiterXPP") return ["\\DeclarePairedDelimiterXPP\\abs[1]{}{\\lvert}{\\rvert}{}{#1}\\abs{x}"];
	if (name === "\\Axiom") return ["\\begin{prooftree}\\Axiom$A\\fCenter B$\\UnaryInf$C\\fCenter D$\\end{prooftree}"];
	if (name === "\\QuinaryInf") return ["\\begin{prooftree}" + "ABCDE".split("").map((c) => `\\Axiom$${c}\\fCenter ${c}$`).join("") + "\\QuinaryInf$F\\fCenter G$\\end{prooftree}"];
	return [
		`${name}{x}`, `${name}{x}{y}`, `${name} x`, `${name}{1em}x`, `x${name}1em y`,
		`\\left${name} x \\right.`, `${name}( x ${name})`, `${name}(x`,
		`\\begin{matrix}a ${name} b\\end{matrix}`, `\\begin{array}{c}a\\\\ ${name} b\\end{array}`,
		`\\text{${name}}`, `\\text{a ${name} b}`, `${name}\\foo{x}\\foo`, `${name}{\\foo}{x}\\foo`,
		`a ${name} b`, `${name}{red}{x}`, `${name}{x}{y}{z}`,
		// Commands that only work in a context.
		`\\left( x ${name}| y \\right)`,
		`${name}\\lim_{n} \\sup_{m} x`,
		`${name}\\foo=x\\foo`,
		`\\begin{aligned}${name}{c}a&=b\\end{aligned}`,
		`${name}{mycolor}{RGB}{255,0,0}\\color{mycolor}x`,
		`${name}\\abs{\\lvert}{\\rvert}\\abs{x}`,
		`${name}\\abs[1]{\\lvert}{\\rvert}{#1}\\abs{x}`,
		`${name}{}x`,
		`\\begin{align}${name}{a&=b}\\end{align}`,
		`\\begin{alignat*}{2}a&=b\\\\ ${name}{\\Leftrightarrow} c&=d\\end{alignat*}`,
		`\\begin{multline}a\\\\ ${name}{b}\\\\ c\\end{multline}`,
		`\\begin{prooftree}${name}{A}\\end{prooftree}`,
		`\\begin{prooftree}\\AxiomC{A}${name}{B}\\end{prooftree}`,
		`\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}${name}{C}\\end{prooftree}`,
		`\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}${name}{D}\\end{prooftree}`,
		`\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\AxiomC{D}${name}{E}\\end{prooftree}`,
		`\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\AxiomC{D}\\AxiomC{E}${name}{F}\\end{prooftree}`,
		`\\begin{prooftree}\\AxiomC{A}${name}{L}\\UnaryInfC{B}\\end{prooftree}`,
		`\\begin{prooftree}\\AxiomC{A}${name}\\UnaryInfC{B}\\end{prooftree}`,
		`\\begin{prooftree}${name}\\AxiomC{A}\\UnaryInfC{B}\\end{prooftree}`,
		`\\begin{prooftree}${name}$A\\fCenter B$\\end{prooftree}`,
		`\\begin{prooftree}\\Axiom$A\\fCenter B$${name}$C\\fCenter D$\\end{prooftree}`,
		`\\begin{prooftree}\\Axiom$A\\fCenter B$\\Axiom$C\\fCenter D$${name}$E\\fCenter F$\\end{prooftree}`,
		`\\begin{prooftree}\\Axiom$A\\fCenter B$\\Axiom$C\\fCenter D$\\Axiom$E\\fCenter F$${name}$G\\fCenter H$\\end{prooftree}`,
		`\\begin{prooftree}\\Axiom$A\\fCenter B$\\Axiom$C\\fCenter D$\\Axiom$E\\fCenter F$\\Axiom$G\\fCenter H$${name}$I\\fCenter J$\\end{prooftree}`,
		`\\begin{prooftree}\\Axiom$A${name} B$\\end{prooftree}`,
		`${name}\\myarrow{x}\\myarrow{y}`,
		`${name}{\\xmyarrow}{5,5}{\\rightarrow}\\xmyarrow{x}`,
	];
}

/** `tex` with its helper names (\\foo, \\abs, mycolor, …) renamed consistently to names not used before. */
function isolate(tex) {
	const renamed = new Map();
	const fresh = (name) => {
		if (!renamed.has(name)) renamed.set(name, freshMacro());
		return renamed.get(name);
	};
	return tex
		.replace(/\\(foo|abs|set|sgn|myarrow|xmyarrow|boxit)\b/g, (match) => fresh(match))
		.replace(/\b(mycolor|myenv)\b/g, (match) => fresh(match).slice(1));
}

/** The first candidate that renders. */
async function firstRendering(candidates) {
	for (const tex of candidates) if (!(await renderError(isolate(tex)))) return tex;
	return null;
}

const known = catalog();
const out = [];
const stats = {examplesDropped: 0, snippetsDropped: 0, snippetsAdded: 0, previewsAdded: 0, added: 0, removed: [], noPreview: []};

async function finish(entry, generated) {
	const isCommand = entry.name.startsWith("\\");
	const isEnvironment = /^[A-Za-z]+\*?$/.test(entry.name);
	// Examples: keep the ones that render.
	const examples = [];
	for (const example of [].concat(entry.examples ?? [])) {
		const trimmed = example.trim();
		// The scraped page often showed the same example inline and in display mode.
		if (trimmed === "" || examples.includes(trimmed)) continue;
		if (await renderError(trimmed)) stats.examplesDropped++;
		else examples.push(trimmed);
	}
	// Snippets: keep if they render once filled in; otherwise drop.
	let snippet = entry.snippet;
	if (snippet && !(await renderableFill(snippet))) {
		stats.snippetsDropped++;
		snippet = undefined;
	}
	const bareError = isCommand || !isEnvironment ? await renderError(entry.name) : "environment";
	if (!snippet && isCommand && bareError && /Missing argument/.test(bareError)) {
		snippet = (await argumentSnippet(entry.name)) ?? undefined;
		if (snippet) stats.snippetsAdded++;
	}
	if (!snippet && isEnvironment) {
		for (const candidate of [
			`\\begin{${entry.name}}\n\t@1@\n\\end{${entry.name}}`,
			`\\begin{${entry.name}}{@1@}\n\t@2@\n\\end{${entry.name}}`,
		]) {
			if (await renderableFill(candidate)) {
				snippet = candidate;
				stats.snippetsAdded++;
				break;
			}
		}
	}
	let usage = null;
	let noPreview = false;
	if (DEFINING.test(entry.name)) {
		usage = USAGE[entry.name] ?? null;
		if (usage && (await renderError(isolate(usage)))) {
			throw new Error(`Usage example for ${entry.name} does not render: ${usage}`);
		}
		noPreview = true;
		examples.length = 0;
		// Argument-count guesses do not fit commands whose first argument is a command name.
		if (!entry.snippet) snippet = undefined;
	}
	// Preview: the suggestion list shows the first example, or the bare command. Make sure one renders.
	// Names without a backslash (environments, ".", "=") are never previewed bare, so they always need one.
	if (!noPreview && examples.length === 0 && (bareError || !isCommand)) {
		const fromSnippet = snippet ? await renderableFill(snippet) : null;
		const preview = fromSnippet ?? (isCommand ? await firstRendering(previewTemplates(entry.name)) : !isEnvironment ? await firstRendering(previewTemplates(entry.name)) : null);
		if (preview) {
			examples.push(preview);
			stats.previewsAdded++;
		} else {
			noPreview = true;
		}
	}
	if (noPreview) stats.noPreview.push(entry.name);
	const result = {name: entry.name};
	const pkg = known.get(entry.name)?.pkg;
	if (pkg) result.package = pkg;
	let description = cleanDescription(entry.description) ?? generated;
	if (usage && !(description ?? "").includes(usage)) description = `${description ? `${description}\n\n` : ""}Usage: \`${usage}\``;
	if (description) result.description = description;
	if (examples.length) result.examples = examples;
	if (entry.see_also?.length) result.see_also = entry.see_also;
	if (snippet) result.snippet = snippet;
	if (noPreview) result.preview = false;
	return result;
}

for (const entry of curated) {
	const name = entry.name;
	// Commands MathJax no longer knows (and that do not render) are removed; everything else is kept.
	if (/^\\[A-Za-z]+$/.test(name) && !known.has(name) && (await renderError(name)) && !(await argumentSnippet(name))) {
		stats.removed.push(name);
		continue;
	}
	out.push(await finish(entry));
}

const have = new Set(out.map((entry) => entry.name));
const additions = [...known.entries()].filter(([name]) => !have.has(name)).sort(([a], [b]) => a.localeCompare(b));
for (const [name, {kind, pkg}] of additions) {
	const what = kind === "environment" ? "Environment" : kind === "character" ? "Symbol" : kind === "delimiter" ? "Delimiter" : "Command";
	const generated = `${what} from the ${pkg} package.`;
	out.push(await finish({name}, generated));
	stats.added++;
}

writeFileSync(PATH, JSON.stringify(out, null, "\t") + "\n");
console.log(JSON.stringify({entries: out.length, curated: curated.length, ...stats}, null, 2));
