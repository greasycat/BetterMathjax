import {describe, expect, it} from "vitest";
import {renderError} from "../scripts/mathjax-node.mjs";
import builtin from "../src/symbols/builtin-symbols.json";
import type {SymbolEntry} from "../src/symbols/types";

// Renders the whole built-in table with the MathJax version and TeX packages Obsidian ships.
const entries = builtin as SymbolEntry[];
const FILLS = ["x", "c", "2", "1em", "align"];

async function fillRenders(snippet: string): Promise<boolean> {
	for (const fill of FILLS) if (!(await renderError(snippet.replace(/@\d+@/g, fill)))) return true;
	return false;
}

describe("built-in symbols", () => {
	it("has unique names", () => {
		expect(new Set(entries.map((entry) => entry.name)).size).toBe(entries.length);
	});

	it("renders every example", async () => {
		const failures: string[] = [];
		for (const entry of entries) {
			for (const example of [].concat((entry.examples ?? []) as never)) {
				const error = await renderError(example);
				if (error) failures.push(`${entry.name}: ${example} → ${error}`);
			}
		}
		expect(failures).toEqual([]);
	}, 60_000);

	it("renders every snippet once its placeholders are filled in", async () => {
		const failures: string[] = [];
		for (const entry of entries) {
			if (entry.snippet && !(await fillRenders(entry.snippet))) failures.push(`${entry.name}: ${entry.snippet}`);
		}
		expect(failures).toEqual([]);
	}, 60_000);

	it("has a preview that renders for every symbol that shows one", async () => {
		const failures: string[] = [];
		for (const entry of entries) {
			if (entry.preview === false) continue;
			const examples = [].concat((entry.examples ?? []) as never) as string[];
			// The suggestion list shows the first example, or else the command itself.
			const preview = examples[0] ?? (entry.name.startsWith("\\") ? entry.name : null);
			if (preview === null) failures.push(`${entry.name}: no preview`);
			else if (await renderError(preview)) failures.push(`${entry.name}: ${preview} → ${await renderError(preview)}`);
		}
		expect(failures).toEqual([]);
	}, 60_000);

	it("never previews a command that defines macros", () => {
		const defining = entries.filter((entry) => /^\\(label|def|let|newcommand|renewcommand|newenvironment|DeclareMathOperator|DeclarePairedDelimiter)$/.test(entry.name));
		expect(defining.length).toBeGreaterThan(5);
		expect(defining.filter((entry) => entry.preview !== false || entry.examples)).toEqual([]);
	});
});
