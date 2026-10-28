/**
 * What the text before the cursor asks to complete. Pure, so it can be tested without an editor.
 * - "command": `\name`, matched against every symbol.
 * - "begin": `\begin{name`, matched against environments; the completion replaces the whole `\begin{…}`.
 * - "word": a bare word of two or more letters, matched against every symbol by prefix only, so that
 *   most variables such as `xy` do not open the list. Accepting a command inserts its backslash.
 */
export type TriggerKind = "command" | "begin" | "word";

export interface Trigger {
	kind: TriggerKind;
	query: string;
	/** Offset in the line where the replaced text starts. */
	from: number;
	/** Characters after the cursor that the completion also replaces (a `}` the editor paired automatically). */
	extend: number;
}

const COMMAND = /\\([A-Za-z]+)$/;
const BEGIN = /\\begin\{([A-Za-z]*\*?)$/;
// Not preceded by a letter, digit or backslash, so it is a whole word and not the end of `\cmd` or `x2y`.
const WORD = /(?:^|[^A-Za-z0-9\\])([A-Za-z]{2,}\*?)$/;

export function detectTrigger(before: string, after: string, words: boolean): Trigger | null {
	const begin = BEGIN.exec(before);
	if (begin) {
		return {kind: "begin", query: begin[1]!, from: begin.index, extend: after.startsWith("}") ? 1 : 0};
	}
	const command = COMMAND.exec(before);
	if (command) return {kind: "command", query: command[1]!, from: command.index, extend: 0};
	if (!words) return null;
	const word = WORD.exec(before);
	if (!word) return null;
	return {kind: "word", query: word[1]!, from: before.length - word[1]!.length, extend: 0};
}
