import {describe, expect, it} from "vitest";
import {applyChanges, formatAllMath, formatRegion, regionAt} from "../src/format/format-note";
import {scanMath} from "../src/math/context";

const note = [
	"# Title",
	"",
	"Inline $a  +   b$ and `$not math$` here.",
	"",
	"$$",
	"\\begin{pmatrix}1&2\\\\30&4\\end{pmatrix}",
	"$$",
	"",
	"> [!note]",
	"> $$",
	"> \\begin{cases}x&a\\\\yy&b\\end{cases}",
	"> $$",
	"",
	"```",
	"$$ \\begin{matrix}a&b\\end{matrix} $$",
	"```",
	"",
].join("\n");

const expected = [
	"# Title",
	"",
	"Inline $a + b$ and `$not math$` here.",
	"",
	"$$",
	"\\begin{pmatrix}",
	"\t1  & 2 \\\\",
	"\t30 & 4",
	"\\end{pmatrix}",
	"$$",
	"",
	"> [!note]",
	"> $$",
	"> \\begin{cases}",
	"> \tx  & a \\\\",
	"> \tyy & b",
	"> \\end{cases}",
	"> $$",
	"",
	"```",
	"$$ \\begin{matrix}a&b\\end{matrix} $$",
	"```",
	"",
].join("\n");

describe("scanMath regions", () => {
	it("reports closed regions with and without their delimiters", () => {
		const text = "a $x$ b $$y$$";
		const regions = scanMath(text).regions;
		expect(regions.map((r) => [r.mode, text.slice(r.from, r.to), text.slice(r.start, r.end)]))
			.toEqual([["inline", "x", "$x$"], ["display", "y", "$$y$$"]]);
	});

	it("keeps offsets right with CRLF line endings", () => {
		const text = "a\r\n$$\r\nx\r\n$$";
		const [region] = scanMath(text).regions;
		expect(text.slice(region!.start, region!.end)).toBe("$$\r\nx\r\n$$");
	});
});

describe("formatting a note", () => {
	it("formats display and inline math, keeps callout prefixes, and skips code", () => {
		expect(applyChanges(note, formatAllMath(note, "\t"))).toBe(expected);
	});

	it("does nothing on an already formatted note", () => {
		expect(formatAllMath(expected, "\t")).toEqual([]);
	});

	it("formats only the region at the cursor", () => {
		const offset = note.indexOf("cases");
		const region = regionAt(note, offset)!;
		const formatted = applyChanges(note, [formatRegion(note, region, "\t")!]);
		expect(formatted).toContain("> \tyy & b");
		expect(formatted).toContain("\\begin{pmatrix}1&2\\\\30&4\\end{pmatrix}");
		expect(regionAt(note, note.indexOf("# Title"))).toBeNull();
	});

	it("never splits inline math over lines", () => {
		const text = "see $\\begin{matrix}a&b\\end{matrix}$ here";
		expect(formatAllMath(text, "\t")).toEqual([]);
	});

	it("leaves a block alone when its lines do not share the prefix", () => {
		const text = "> $$\n\\begin{matrix}a&b\\end{matrix}\n> $$";
		expect(formatAllMath(text, "\t")).toEqual([]);
	});

	it("turns a one-line block with an environment into a multi-line block", () => {
		expect(applyChanges("$$\\begin{matrix}a&b\\end{matrix}$$", formatAllMath("$$\\begin{matrix}a&b\\end{matrix}$$", "  ")))
			.toBe("$$\n\\begin{matrix}\n  a & b\n\\end{matrix}\n$$");
	});
});

describe("formatting stays safe", () => {
	const format = (text: string) => applyChanges(text, formatAllMath(text, "  "));

	it("leaves text between a stray $$ and the next block alone", () => {
		const text = "Some text $$\nfirst paragraph  of   prose\n\nsecond - item\n# Heading\n$$x$$";
		expect(format(text)).toBe(text);
	});

	it("leaves inline math that continues on a blockquote line alone", () => {
		const text = "> [!note]\n> see $a +\n> b$ here";
		expect(format(text)).toBe(text);
	});

	it("indents a block that opens on a list line past the list marker", () => {
		expect(format("1. $$\\begin{cases} a \\\\ b \\end{cases}$$"))
			.toBe("1. $$\n   \\begin{cases}\n     a \\\\\n     b\n   \\end{cases}\n   $$");
		expect(format("> - $$\\begin{matrix}a&b\\end{matrix}$$"))
			.toBe("> - $$\n>   \\begin{matrix}\n>     a & b\n>   \\end{matrix}\n>   $$");
	});

	it("keeps a trailing control space so the closing $$ is not escaped", () => {
		expect(format("$$a\\ $$")).toBe("$$a\\ $$");
	});
});
