import {describe, expect, it} from "vitest";
import {mathModeAt} from "../src/math/context";

describe("mathModeAt", () => {
	it.each([
		["plain text \\al", null],
		["$\\al", "inline"],
		["$x$ then \\al", null],
		["$x$ and $\\al", "inline"],
		["$$\n\\frac", "display"],
		["$$\na\n$$\n\\al", null],
		["$$x$$ \\al", null],
		["costs $ 5 \\al", null],
		["\\$ \\al", null],
		// An escaped backslash does not escape the dollar after it (PR #8's lookbehind got this wrong).
		["\\\\$\\al", "inline"],
		["a \\$ b $\\al", "inline"],
		["`$` \\al", null],
		["`` a ` $ `` \\al", null],
		["```\n$\n```\n$\\al", "inline"],
		["```\n$\\al", null],
		["~~~~\n```\n$\n~~~~\n$\\al", "inline"],
		["$a\n\n\\al", null],
		["$$\na\n\nb \\al", "display"],
		["---\ntitle: $x\n---\n\\al", null],
		["---\ntitle: x\n---\n$\\al", "inline"],
		["$a \\$ b \\al", "inline"],
		["$a $ b \\al", "inline"],
		["> $$\n> \\al", "display"],
		["- item $\\al", "inline"],
		["$", "inline"],
		["line1\r\n$\\al", "inline"],
	] as const)("%j -> %s", (text, expected) => {
		expect(mathModeAt(text)).toBe(expected);
	});
});
