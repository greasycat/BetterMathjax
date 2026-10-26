import {describe, expect, it} from "vitest";
import {mathml} from "../scripts/mathjax-node.mjs";
import {formatMath} from "../src/format/tex-format";
import builtin from "../src/symbols/builtin-symbols.json";
import type {SymbolEntry} from "../src/symbols/types";

const SAMPLES: Record<string, [string, string]> = {
	align: [
		"\\begin{align}a&=b+c\\\\ d &=   e+\\frac{1}{2}\\end{align}",
		"\\begin{align}\n\ta & =b+c \\\\\n\td & = e+\\frac{1}{2}\n\\end{align}",
	],
	matrix: [
		"\\begin{pmatrix}1&2&3\\\\40&5&6\\\\7&80&900\\end{pmatrix}",
		"\\begin{pmatrix}\n\t1  & 2  & 3 \\\\\n\t40 & 5  & 6 \\\\\n\t7  & 80 & 900\n\\end{pmatrix}",
	],
	cases: [
		"f(x)=\\begin{cases}x^2&x\\ge0\\\\ -x & \\text{otherwise}\\end{cases}",
		"f(x)= \\begin{cases}\n\tx^2 & x\\ge0 \\\\\n\t-x  & \\text{otherwise}\n\\end{cases}",
	],
	inline: ["\\frac{a}{b}+\\sqrt{x^2+y^2}  =   \\sum_{i=1}^{n}i", "\\frac{a}{b}+\\sqrt{x^2+y^2} = \\sum_{i=1}^{n}i"],
	array: [
		"\\begin{array}{c|c}a&b\\\\\\hline c&dd\\end{array}",
		"\\begin{array}{c|c}\n\ta & b \\\\\n\t\\hline\n\tc & dd\n\\end{array}",
	],
	nested: [
		"\\begin{bmatrix}\\begin{matrix}a&b\\end{matrix}&c\\\\d&e\\end{bmatrix}",
		"\\begin{bmatrix}\n\t\\begin{matrix}\n\t\ta & b\n\t\\end{matrix} & c \\\\\n\td & e\n\\end{bmatrix}",
	],
	text: ["x  \\text{if  a   b}  y", "x \\text{if  a   b} y"],
	trailingRow: ["\\begin{align}a&=b\\\\\\end{align}", "\\begin{align}\n\ta & =b \\\\\n\\end{align}"],
	rowSpacing: ["\\begin{gather}a\\\\[2pt]b\\end{gather}", "\\begin{gather}\n\ta \\\\[2pt]\n\tb\n\\end{gather}"],
};

describe("formatMath", () => {
	for (const [name, [input, expected]] of Object.entries(SAMPLES)) {
		it(`formats ${name}`, () => {
			expect(formatMath(input)).toBe(expected);
		});
	}

	it("indents with the given unit", () => {
		expect(formatMath("\\begin{matrix}a\\end{matrix}", "  ")).toBe("\\begin{matrix}\n  a\n\\end{matrix}");
	});

	it("leaves input it cannot format safely unchanged", () => {
		for (const input of ["\\begin{align}a&b", "a}b", "\\begin{align}a\\end{gather}", "\\begin{align}a % note\n&b\\end{align}", "a % c\nb"]) {
			expect(formatMath(input)).toBe(input);
		}
	});

	it("is idempotent", () => {
		for (const [input] of Object.values(SAMPLES)) {
			const once = formatMath(input);
			expect(formatMath(once)).toBe(once);
		}
	});

	it("never changes what MathJax renders", async () => {
		const inputs = Object.values(SAMPLES).map(([input]) => input);
		for (const entry of builtin as SymbolEntry[]) {
			inputs.push(...([] as string[]).concat(entry.examples ?? []));
			if (entry.snippet) inputs.push(entry.snippet.replace(/@\d+@/g, "x"));
		}
		const changed: string[] = [];
		let formatted = 0;
		for (const input of inputs) {
			const output = formatMath(input);
			if (output === input) continue;
			formatted++;
			if ((await mathml(input)) !== (await mathml(output))) changed.push(`${JSON.stringify(input)} → ${JSON.stringify(output)}`);
		}
		expect(formatted).toBeGreaterThan(100);
		expect(changed).toEqual([]);
	}, 60_000);
});
