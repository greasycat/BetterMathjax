export type MathMode = "inline" | "display";

/** A closed math region. `from`…`to` is the TeX between the delimiters; `start`…`end` includes them. */
export interface MathRegion {
	mode: MathMode;
	start: number;
	from: number;
	to: number;
	end: number;
}

const FENCE_OPEN = /^ {0,3}(`{3,}|~{3,})/;

/**
 * Decide whether the end of `text` (everything before the cursor) is inside a math region,
 * following the Markdown rules Obsidian renders:
 * - `$$ … $$` is display math and may span lines.
 * - `$ … $` is inline math: the opening `$` must not be followed by whitespace, the closing `$`
 *   must not be preceded by whitespace, and a blank line ends it.
 * - `\$` is a literal dollar sign.
 * - Dollars in fenced code blocks, inline code spans and the YAML frontmatter do not count.
 */
export function mathModeAt(text: string): MathMode | null {
	return scanMath(text).mode;
}

/** Where a scan stands at the start of a line: everything the rules need from the lines before it. */
export interface ScanState {
	mode: MathMode | null;
	/** The fence of the open code block, if any. */
	fence: string | null;
	/** Length of the backtick run that opened an inline code span still open at the line end. */
	codeTicks: number;
	/** "open" while inside the YAML frontmatter. */
	frontmatter: "none" | "open";
	/** Where the open math region starts, and the width of its delimiter. */
	openAt: number;
	openWidth: number;
}

export function initialScanState(): ScanState {
	return {mode: null, fence: null, codeTicks: 0, frontmatter: "none", openAt: 0, openWidth: 0};
}

/**
 * Advance `state` over one line (without its line ending). `index` is the 0-based line number, `base` the
 * line's offset, and `last` whether the text ends with this line (the cursor is at its end). Calls
 * `onRegion` for each math region the line closes.
 */
export function scanLine(state: ScanState, line: string, index: number, base: number, last: boolean, onRegion?: (region: MathRegion) => void): void {
	if (index === 0 && line === "---") {
		state.frontmatter = "open";
		return;
	}
	if (state.frontmatter === "open") {
		if (line === "---") state.frontmatter = "none";
		return;
	}
	if (state.fence !== null) {
		const fenceClose = line.match(FENCE_OPEN);
		if (fenceClose && fenceClose[1]![0] === state.fence[0] && fenceClose[1]!.length >= state.fence.length && line.trim() === fenceClose[1]) state.fence = null;
		return;
	}
	if (state.mode === null && state.codeTicks === 0) {
		const fenceOpen = line.match(FENCE_OPEN);
		if (fenceOpen) {
			state.fence = fenceOpen[1]!;
			return;
		}
	}
	if (line.trim() === "") {
		if (state.mode === "inline") state.mode = null;
		state.codeTicks = 0;
		return;
	}

	let i = 0;
	while (i < line.length) {
		const char = line[i];
		if (state.codeTicks > 0) {
			if (char === "`") {
				const run = runLength(line, i, "`");
				if (run === state.codeTicks) state.codeTicks = 0;
				i += run;
			} else {
				i++;
			}
			continue;
		}
		if (char === "\\") {
			i += 2;
			continue;
		}
		if (char === "`" && state.mode === null) {
			state.codeTicks = runLength(line, i, "`");
			i += state.codeTicks;
			continue;
		}
		if (char === "$") {
			if (line[i + 1] === "$") {
				if (state.mode === "inline") {
					onRegion?.(region(state, "inline", base + i, 1));
					state.mode = null;
					i += 1;
					continue;
				}
				if (state.mode === "display") {
					onRegion?.(region(state, "display", base + i, 2));
					state.mode = null;
				} else {
					state.openAt = base + i;
					state.openWidth = 2;
					state.mode = "display";
				}
				i += 2;
				continue;
			}
			if (state.mode === null) {
				const next = line[i + 1];
				// At the very end of the text the cursor sits right after `$`, so treat it as an opener.
				if (next === undefined ? last : !/\s/.test(next)) {
					state.openAt = base + i;
					state.openWidth = 1;
					state.mode = "inline";
				}
			} else if (state.mode === "inline") {
				const prev = line[i - 1];
				if (prev !== undefined && !/\s/.test(prev)) {
					onRegion?.(region(state, "inline", base + i, 1));
					state.mode = null;
				}
			}
			i++;
			continue;
		}
		i++;
	}
}

/** The region from the open delimiter in `state` to the closing one at `at`. */
function region(state: ScanState, mode: MathMode, at: number, width: number): MathRegion {
	return {mode, start: state.openAt, from: state.openAt + state.openWidth, to: at, end: at + width};
}

/** The mode a scan in `state` has reached. An unclosed frontmatter holds no math. */
export function scanMode(state: ScanState): MathMode | null {
	return state.frontmatter === "open" ? null : state.mode;
}

/** Every closed math region in `text`, and the mode at its end (see `mathModeAt` for the rules). */
export function scanMath(text: string): {mode: MathMode | null; regions: MathRegion[]} {
	const lines = text.split(/\r?\n/);
	const found: MathRegion[] = [];
	const state = initialScanState();
	// Offsets are tracked per line, so positions survive CRLF line endings.
	for (let n = 0, at = 0; n < lines.length; n++) {
		const line = lines[n]!;
		scanLine(state, line, n, at, n === lines.length - 1, (region) => found.push(region));
		at += line.length + (text[at + line.length] === "\r" ? 2 : 1);
	}
	return {mode: scanMode(state), regions: found};
}

function runLength(line: string, from: number, char: string): number {
	let end = from;
	while (line[end] === char) end++;
	return end - from;
}
