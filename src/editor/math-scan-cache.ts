import {StateField, type EditorState, type Text} from "@codemirror/state";
import {initialScanState, scanLine, scanMode, type MathMode, type ScanState} from "../math/context";

/** Lines between saved scan states. A lookup scans at most this many lines plus the cursor's own line. */
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
		const target = this.doc.lineAt(pos);
		const k = Math.min(this.saved.length - 1, Math.floor((target.number - 1) / STEP));
		const state = {...this.saved[k]!};
		for (let number = k * STEP + 1; number < target.number; number++) {
			const line = this.doc.line(number);
			scanLine(state, line.text, number - 1, line.from, false);
			// Save the state at each STEP boundary passed for the first time.
			if (number % STEP === 0 && this.saved.length === number / STEP) this.saved.push({...state});
		}
		scanLine(state, this.doc.sliceString(target.from, pos), target.number - 1, target.from, true);
		return scanMode(state);
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

/** The math mode at `pos`, using the cache when the editor has it. */
export function mathModeInState(state: EditorState, pos: number): MathMode | null {
	return (state.field(mathScanField, false) ?? MathScanCache.create(state.doc)).modeAt(pos);
}
