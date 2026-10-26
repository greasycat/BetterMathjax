import {EditorState} from "@codemirror/state";
import {describe, expect, it} from "vitest";
import {mathModeInState, mathScanField} from "../src/editor/math-scan-cache";
import {mathModeAt} from "../src/math/context";

const PIECES = ["$", "$$", "\\$", "\\\\", "`", "```", "~~~", "\n", "\n", "\n", "\n\n", "a", "x ", " ", "---", "> ", "- "];

/** A small deterministic generator, so a failure can be reproduced. */
function random(seed: number): () => number {
	let s = seed;
	return () => {
		s = (s * 1103515245 + 12345) % 2147483648;
		return s / 2147483648;
	};
}

function randomText(next: () => number, pieces: number): string {
	let text = "";
	for (let i = 0; i < pieces; i++) text += PIECES[Math.floor(next() * PIECES.length)];
	return text;
}

function expectSameAsFullScan(state: EditorState, next: () => number): void {
	const text = state.doc.toString();
	for (let i = 0; i < 40; i++) {
		const pos = Math.floor(next() * (text.length + 1));
		expect(mathModeInState(state, pos), `at ${pos}`).toBe(mathModeAt(text.slice(0, pos)));
	}
}

describe("cached math scan", () => {
	it("gives the same mode as a full scan, before and after edits", () => {
		for (let seed = 1; seed <= 30; seed++) {
			const next = random(seed);
			let state = EditorState.create({doc: randomText(next, 600), extensions: [mathScanField]});
			expect(state.doc.lines).toBeGreaterThan(64);
			expectSameAsFullScan(state, next);
			for (let edit = 0; edit < 15; edit++) {
				const length = state.doc.length;
				const from = Math.floor(next() * (length + 1));
				const to = Math.min(length, from + Math.floor(next() * 40));
				state = state.update({changes: {from, to, insert: randomText(next, Math.floor(next() * 6))}}).state;
				expectSameAsFullScan(state, next);
			}
		}
	});

	it("works without the field installed", () => {
		const state = EditorState.create({doc: "$$\n\\frac"});
		expect(mathModeInState(state, state.doc.length)).toBe("display");
	});
});
