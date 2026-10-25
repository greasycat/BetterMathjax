import {describe, expect, it} from "vitest";
import {detectTrigger} from "../src/editor/trigger";

describe("detectTrigger", () => {
	it("finds backslash commands", () => {
		expect(detectTrigger("x + \\alp", "", true)).toEqual({kind: "command", query: "alp", from: 4, extend: 0});
	});

	it("finds environment names after \\begin{, including a paired brace after the cursor", () => {
		expect(detectTrigger("\\begin{pm", "}", true)).toEqual({kind: "begin", query: "pm", from: 0, extend: 1});
		expect(detectTrigger("a \\begin{", "", true)).toEqual({kind: "begin", query: "", from: 2, extend: 0});
		expect(detectTrigger("\\begin{align*", "", true)).toMatchObject({kind: "begin", query: "align*"});
	});

	it("finds bare words of two or more letters", () => {
		expect(detectTrigger("x = pmat", "", true)).toEqual({kind: "word", query: "pmat", from: 4, extend: 0});
		expect(detectTrigger("al", "", true)).toMatchObject({kind: "word", query: "al", from: 0});
		expect(detectTrigger("{cases*", "", true)).toMatchObject({kind: "word", query: "cases*", from: 1});
	});

	it("ignores single letters, words glued to digits, and bare words when turned off", () => {
		expect(detectTrigger("x + a", "", true)).toBeNull();
		expect(detectTrigger("2ab", "", true)).toBeNull();
		expect(detectTrigger("pmat", "", false)).toBeNull();
	});
});
