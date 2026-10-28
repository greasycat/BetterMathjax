import {StateField, type EditorState, type Text} from "@codemirror/state";
import {initialScanState, scanLine, scanMode, type MathMode, type ScanState} from "../math/context";

/**
 * Lines between saved scan states. While typing, a lookup scans at most this many lines plus the cursor's own
 * line. The first lookup in a note, or the first after an edit far above the cursor, scans from the last saved
 * state, which can be the top of the note.
 */
const STEP = 64;

/**
 * The math scan of a document, saved at every STEP-th line so the mode at the cursor does not need a scan
 * from the top of the note on every keystroke. An edit keeps the saved states above the first changed line.
 */
export class MathScanCache {
	/** `saved[k]` is the state at the start of line `k * STEP + 1` (1-based); `saved[0]` is the initial state. */
	private constructor(private readonly doc: Text, private readonly saved: ScanState[]) {}

	static create(doc: Text): MathScanCache {
		return new MathScanCache(doc, [initialScanState()]);
	}

	/** The cache for `doc`, keeping saved states for lines up to `firstChangedLine`. */
	after(doc: Text, firstChangedLine: number): MathScanCache {
		// The state at the start of line L depends only on lines before L.
		const keep = Math.floor((firstChangedLine - 1) / STEP) + 1;
		return new MathScanCache(doc, this.saved.slice(0, Math.max(1, keep)));
	}

	/** The math mode at `pos`, as `mathModeAt` would give for the text before it. */
	modeAt(pos: number): MathMode | null {
		return scanMode(this.stateAt(pos));
	}

	/** Where the math around `pos` opens (the offset of its `$`), or null outside math. */
	openAt(pos: number): number | null {
		const state = this.stateAt(pos);
		return scanMode(state) === null ? null : state.openAt;
	}

	private stateAt(pos: number): ScanState {
		const target = this.doc.lineAt(pos);
		const k = Math.min(this.saved.length - 1, Math.floor((target.number - 1) / STEP));
		const state = {...this.saved[k]!};
		let number = k * STEP + 1;
		let from = this.doc.line(number).from;
		// iterLines walks the lines in order, which is cheaper than looking each one up. An empty range still
		// yields one empty line, so skip the loop when the cursor is on the saved line itself.
		const lines = number < target.number ? this.doc.iterLines(number, target.number) : [];
		for (const text of lines) {
			scanLine(state, text, number - 1, from, false);
			// Save the state at each STEP boundary passed for the first time.
			if (number % STEP === 0 && this.saved.length === number / STEP) this.saved.push({...state});
			from += text.length + 1;
			number++;
		}
		scanLine(state, this.doc.sliceString(target.from, pos), target.number - 1, target.from, true);
		return state;
	}
}

export const mathScanField = StateField.define<MathScanCache>({
	create: (state) => MathScanCache.create(state.doc),
	update(cache, tr) {
		if (!tr.docChanged) return cache;
		let first = Infinity;
		tr.changes.iterChangedRanges((fromA) => {
			first = Math.min(first, fromA);
		});
		return cache.after(tr.state.doc, tr.startState.doc.lineAt(first).number);
	},
});

function cacheOf(state: EditorState): MathScanCache {
	return state.field(mathScanField, false) ?? MathScanCache.create(state.doc);
}

/** The math mode at `pos`, using the cache when the editor has it. */
export function mathModeInState(state: EditorState, pos: number): MathMode | null {
	return cacheOf(state).modeAt(pos);
}

/** The offset of the `$` that opens the math around `pos`, or null outside math. */
export function mathOpenInState(state: EditorState, pos: number): number | null {
	return cacheOf(state).openAt(pos);
}
