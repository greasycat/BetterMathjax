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

/** Every closed math region in `text`, and the mode at its end (see `mathModeAt` for the rules). */
export function scanMath(text: string): {mode: MathMode | null; regions: MathRegion[]} {
	const lines = text.split(/\r?\n/);
	// Offset of each line in `text`, so positions survive CRLF line endings.
	const offsets: number[] = [];
	for (let n = 0, at = 0; n < lines.length; n++) {
		offsets.push(at);
		at += lines[n]!.length + (text[at + lines[n]!.length] === "\r" ? 2 : 1);
	}
	const regions: MathRegion[] = [];
	let openAt = 0;
	let openWidth = 0;
	const open = (at: number, width: number) => {
		openAt = at;
		openWidth = width;
	};
	const close = (mode: MathMode, at: number, width: number) => {
		regions.push({mode, start: openAt, from: openAt + openWidth, to: at, end: at + width});
	};
	let mode: MathMode | null = null;
	let fence: string | null = null;
	let codeTicks = 0;
	let start = 0;

	if (lines[0] === "---") {
		const end = lines.indexOf("---", 1);
		if (end < 0) return {mode: null, regions};
		start = end + 1;
	}

	for (let n = start; n < lines.length; n++) {
		const line = lines[n] as string;
		const base = offsets[n]!;

		if (fence !== null) {
			const close = line.match(FENCE_OPEN);
			if (close && close[1]![0] === fence[0] && close[1]!.length >= fence.length && line.trim() === close[1]) fence = null;
			continue;
		}
		if (mode === null && codeTicks === 0) {
			const open = line.match(FENCE_OPEN);
			if (open) {
				fence = open[1]!;
				continue;
			}
		}
		if (line.trim() === "") {
			if (mode === "inline") mode = null;
			codeTicks = 0;
			continue;
		}

		let i = 0;
		while (i < line.length) {
			const char = line[i];
			if (codeTicks > 0) {
				if (char === "`") {
					const run = runLength(line, i, "`");
					if (run === codeTicks) codeTicks = 0;
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
			if (char === "`" && mode === null) {
				codeTicks = runLength(line, i, "`");
				i += codeTicks;
				continue;
			}
			if (char === "$") {
				if (line[i + 1] === "$") {
					if (mode === "inline") {
						close("inline", base + i, 1);
						mode = null;
						i += 1;
						continue;
					}
					if (mode === "display") {
						close("display", base + i, 2);
						mode = null;
					} else {
						open(base + i, 2);
						mode = "display";
					}
					i += 2;
					continue;
				}
				if (mode === null) {
					const next = line[i + 1];
					// At the very end of the text the cursor sits right after `$`, so treat it as an opener.
					if (next === undefined ? n === lines.length - 1 : !/\s/.test(next)) {
						open(base + i, 1);
						mode = "inline";
					}
				} else if (mode === "inline") {
					const prev = line[i - 1];
					if (prev !== undefined && !/\s/.test(prev)) {
						close("inline", base + i, 1);
						mode = null;
					}
				}
				i++;
				continue;
			}
			i++;
		}
	}
	return {mode, regions};
}

function runLength(line: string, from: number, char: string): number {
	let end = from;
	while (line[end] === char) end++;
	return end - from;
}
