import type {MathRegion} from "./context";

/** A macro or environment that a note defines in its math. Offsets are in the scanned text. */
export interface MacroDef {
	kind: "command" | "environment" | "let";
	/** `\name` for a command or `\let`, the bare name for an environment. */
	name: string;
	/** The number of arguments, including the optional one. */
	args: number;
	/** The default of the optional first argument, or null if every argument is required. */
	optional: string | null;
	/** The replacement text; for an environment, the begin code. For `\let`, the command it copies. */
	body: string;
	/** The definition as written, from the defining command to the end of its last argument. */
	source: string;
	from: number;
	to: number;
}

const DEFINERS = new Set([
	"newcommand", "renewcommand", "providecommand", "def", "let",
	"DeclareMathOperator", "newenvironment", "renewenvironment",
]);

/**
 * Cheap test for text that may hold a definition. Math delimiters are left out on purpose: they are on most
 * lines that people type in, and a definition rarely leaves math because a delimiter moved.
 */
export const MAY_DEFINE = /\\(?:(?:re|provide)?newcommand|def|let|DeclareMathOperator|(?:re)?newenvironment)(?![A-Za-z])/;

const COMMAND_NAME = /^\\[A-Za-z]+$/;
const ENVIRONMENT_NAME = /^[A-Za-z]+\*?$/;

/** Reads TeX arguments from `text`, starting at `pos`. Every read returns null when the text does not fit. */
class Reader {
	constructor(readonly text: string, public pos: number, readonly end: number) {}

	private skipSpace(): void {
		while (this.pos < this.end && /\s/.test(this.text[this.pos]!)) this.pos++;
	}

	/** A control sequence such as `\foo` or `\{`, or null. */
	controlSequence(): string | null {
		this.skipSpace();
		if (this.text[this.pos] !== "\\" || this.pos + 1 >= this.end) return null;
		let stop = this.pos + 1;
		if (/[A-Za-z]/.test(this.text[stop]!)) {
			while (stop < this.end && /[A-Za-z]/.test(this.text[stop]!)) stop++;
		} else {
			stop++;
		}
		const name = this.text.slice(this.pos, stop);
		this.pos = stop;
		return name;
	}

	/** A braced group's content, a control sequence, or one character. */
	argument(): string | null {
		this.skipSpace();
		if (this.pos >= this.end) return null;
		if (this.text[this.pos] === "{") return this.group();
		if (this.text[this.pos] === "\\") return this.controlSequence();
		if (this.text[this.pos] === "}") return null;
		return this.text[this.pos++]!;
	}

	/** The content of the next braced group. */
	group(): string | null {
		this.skipSpace();
		if (this.text[this.pos] !== "{") return null;
		let depth = 0;
		for (let i = this.pos; i < this.end; i++) {
			const char = this.text[i];
			if (char === "\\") i++;
			else if (char === "{") depth++;
			else if (char === "}" && --depth === 0) {
				const content = this.text.slice(this.pos + 1, i);
				this.pos = i + 1;
				return content;
			}
		}
		return null;
	}

	/** The content of `[...]`, or undefined when there is none. Brackets inside braces do not count. */
	optional(): string | null | undefined {
		this.skipSpace();
		if (this.text[this.pos] !== "[") return undefined;
		let depth = 0;
		for (let i = this.pos + 1; i < this.end; i++) {
			const char = this.text[i];
			if (char === "\\") i++;
			else if (char === "{") depth++;
			else if (char === "}") depth--;
			else if (char === "]" && depth === 0) {
				const content = this.text.slice(this.pos + 1, i);
				this.pos = i + 1;
				return content;
			}
		}
		return null;
	}

	/** A `*` right after the command, as in `\DeclareMathOperator*`. */
	star(): boolean {
		if (this.text[this.pos] !== "*") return false;
		this.pos++;
		return true;
	}
}

/** `[n]` then an optional `[default]`. Returns null for a malformed count. */
function readArgCount(reader: Reader): {args: number; optional: string | null} | null {
	const count = reader.optional();
	if (count === null) return null;
	if (count === undefined) return {args: 0, optional: null};
	if (!/^\s*\d\s*$/.test(count)) return null;
	const optional = reader.optional();
	if (optional === null) return null;
	return {args: Number(count.trim()), optional: optional ?? null};
}

function stripName(name: string | null): string | null {
	return name === null ? null : name.trim();
}

/** Parse the definition whose command name ends at `reader.pos`. */
function readDefinition(definer: string, reader: Reader): Omit<MacroDef, "source" | "from" | "to"> | null {
	switch (definer) {
		case "newcommand":
		case "renewcommand":
		case "providecommand": {
			reader.star();
			const name = stripName(reader.argument());
			if (name === null || !COMMAND_NAME.test(name)) return null;
			const count = readArgCount(reader);
			const body = count && reader.argument();
			if (!count || body === null || body === undefined) return null;
			return {kind: "command", name, ...count, body};
		}
		case "def": {
			const name = reader.controlSequence();
			if (name === null || !COMMAND_NAME.test(name)) return null;
			// The parameter text runs up to the body's brace: `#1#2`.
			const open = reader.text.indexOf("{", reader.pos);
			if (open < 0 || open >= reader.end) return null;
			const params = reader.text.slice(reader.pos, open);
			if (!/^(?:\s*#\d)*\s*$/.test(params)) return null;
			reader.pos = open;
			const body = reader.group();
			if (body === null) return null;
			return {kind: "command", name, args: (params.match(/#/g) ?? []).length, optional: null, body};
		}
		case "let": {
			const name = reader.controlSequence();
			if (name === null || !COMMAND_NAME.test(name)) return null;
			if (reader.text[reader.pos] === "=") reader.pos++;
			const target = reader.controlSequence();
			if (target === null) return null;
			return {kind: "let", name, args: 0, optional: null, body: target};
		}
		case "DeclareMathOperator": {
			const star = reader.star();
			const name = stripName(reader.argument());
			const text = reader.argument();
			if (name === null || !COMMAND_NAME.test(name) || text === null) return null;
			return {kind: "command", name, args: 0, optional: null, body: `\\operatorname${star ? "*" : ""}{${text}}`};
		}
		case "newenvironment":
		case "renewenvironment": {
			const name = stripName(reader.argument());
			if (name === null || !ENVIRONMENT_NAME.test(name)) return null;
			const count = readArgCount(reader);
			if (!count) return null;
			const begin = reader.group();
			if (begin === null || reader.group() === null) return null;
			return {kind: "environment", name, ...count, body: begin};
		}
	}
	return null;
}

/** Find the definitions in the math regions of `text`. A definition that does not parse is skipped. */
export function parseMacros(text: string, regions: readonly MathRegion[]): MacroDef[] {
	const found: MacroDef[] = [];
	for (const region of regions) {
		for (let i = region.from; i < region.to; i++) {
			if (text[i] !== "\\") continue;
			const reader = new Reader(text, i, region.to);
			const command = reader.controlSequence();
			if (command === null) continue;
			const definer = command.slice(1);
			if (DEFINERS.has(definer)) {
				const def = readDefinition(definer, reader);
				if (def) {
					found.push({...def, source: text.slice(i, reader.pos), from: i, to: reader.pos});
					i = reader.pos - 1;
					continue;
				}
			}
			// Step over the whole control sequence, so `\\newcommand` is not read as a definition.
			i += command.length - 1;
		}
	}
	return found;
}
