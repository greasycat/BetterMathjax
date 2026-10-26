/**
 * A minimal formatter for display math. It only changes layout, never meaning:
 * - `\begin{…}` / `\end{…}` bodies are indented, one row per line;
 * - the `&` columns of a row-based environment are aligned;
 * - runs of spaces collapse to one.
 * Anything it does not fully understand (unbalanced braces, unknown `\end`, comments inside an environment)
 * is returned unchanged. Pure, so it can be tested against MathJax.
 */

type Token =
	| {kind: "command"; text: string}
	| {kind: "rowsep"; text: string}
	| {kind: "align"; text: "&"}
	| {kind: "open"; text: "{"}
	| {kind: "close"; text: "}"}
	| {kind: "space"; text: string}
	| {kind: "comment"; text: string}
	| {kind: "char"; text: string};

type Node =
	| {kind: "token"; token: Token}
	| {kind: "group"; children: Node[]}
	| {kind: "env"; name: string; args: string; body: Node[]};

class Unformattable extends Error {}

function tokenize(source: string): Token[] {
	const tokens: Token[] = [];
	let i = 0;
	while (i < source.length) {
		const char = source[i]!;
		if (char === "\\") {
			const next = source[i + 1];
			if (next === "\\") {
				// A row separator, with its optional spacing such as \\[2pt].
				const spacing = /^\[[^\]]*\]/.exec(source.slice(i + 2));
				const text = "\\\\" + (spacing?.[0] ?? "");
				tokens.push({kind: "rowsep", text});
				i += text.length;
			} else if (next !== undefined && /[A-Za-z]/.test(next)) {
				const name = /^\\[A-Za-z]+\*?/.exec(source.slice(i))![0];
				tokens.push(name === "\\cr" ? {kind: "rowsep", text: name} : {kind: "command", text: name});
				i += name.length;
			} else {
				tokens.push({kind: "command", text: source.slice(i, i + 2)});
				i += 2;
			}
		} else if (char === "{" || char === "}") {
			tokens.push(char === "{" ? {kind: "open", text: "{"} : {kind: "close", text: "}"});
			i++;
		} else if (char === "&") {
			tokens.push({kind: "align", text: "&"});
			i++;
		} else if (char === "%") {
			const end = source.indexOf("\n", i);
			const text = end < 0 ? source.slice(i) : source.slice(i, end);
			tokens.push({kind: "comment", text});
			i += text.length;
		} else if (/\s/.test(char)) {
			const text = /^\s+/.exec(source.slice(i))![0];
			tokens.push({kind: "space", text});
			i += text.length;
		} else {
			tokens.push({kind: "char", text: char});
			i++;
		}
	}
	return tokens;
}

/** Environments whose `\begin{name}` is followed by required arguments, and how many. */
const ENV_ARGUMENTS: Record<string, number> = {
	array: 1, darray: 1, subarray: 1, crampedsubarray: 1, alignat: 1, "alignat*": 1, alignedat: 1,
	xalignat: 1, "xalignat*": 1, xxalignat: 1, empheq: 1, spreadlines: 1,
};

/** Commands whose argument is text, where spacing matters and is kept exactly. */
const TEXT_COMMANDS = new Set(["\\text", "\\textrm", "\\textbf", "\\textit", "\\textsf", "\\texttt", "\\mbox", "\\hbox", "\\textnormal", "\\operatorname"]);

function serialize(nodes: readonly Node[]): string {
	return nodes.map((node) => {
		if (node.kind === "token") return node.token.text;
		if (node.kind === "group") return `{${serialize(node.children)}}`;
		return `\\begin{${node.name}}${node.args}${serialize(node.body)}\\end{${node.name}}`;
	}).join("");
}

function parse(tokens: Token[]): Node[] {
	let i = 0;

	const readName = (): string => {
		while (tokens[i]?.kind === "space") i++;
		if (tokens[i]?.kind !== "open") throw new Unformattable();
		i++;
		let name = "";
		while (tokens[i] && tokens[i]!.kind !== "close") name += tokens[i++]!.text;
		if (!tokens[i]) throw new Unformattable();
		i++;
		return name;
	};

	const readGroup = (): Node => {
		i++; // {
		const children = sequence("}");
		if (tokens[i]?.kind !== "close") throw new Unformattable();
		i++;
		return {kind: "group", children};
	};

	const sequence = (until: "}" | {end: string} | null): Node[] => {
		const nodes: Node[] = [];
		while (i < tokens.length) {
			const token = tokens[i]!;
			if (token.kind === "close") {
				if (until === "}") return nodes;
				throw new Unformattable();
			}
			if (token.kind === "open") {
				nodes.push(readGroup());
				continue;
			}
			if (token.kind === "command" && token.text === "\\begin") {
				i++;
				const name = readName();
				// Optional [..] directly after \begin{name}, then the environment's required {..} arguments.
				let args = "";
				if (tokens[i]?.kind === "char" && tokens[i]!.text === "[") {
					while (tokens[i] && !(tokens[i]!.kind === "char" && tokens[i]!.text === "]")) args += tokens[i++]!.text;
					if (!tokens[i]) throw new Unformattable();
					args += tokens[i++]!.text;
				}
				for (let n = ENV_ARGUMENTS[name] ?? 0; n > 0; n--) {
					while (tokens[i]?.kind === "space") args += tokens[i++]!.text;
					if (tokens[i]?.kind !== "open") throw new Unformattable();
					args += serialize([readGroup()]);
				}
				const body = sequence({end: name});
				nodes.push({kind: "env", name, args, body});
				continue;
			}
			if (token.kind === "command" && token.text === "\\end") {
				if (until === null || until === "}") throw new Unformattable();
				i++;
				if (readName() !== until.end) throw new Unformattable();
				return nodes;
			}
			nodes.push({kind: "token", token});
			i++;
		}
		if (until !== null) throw new Unformattable();
		return nodes;
	};

	return sequence(null);
}

/**
 * Trim spaces at both ends, except the space of a trailing control space `\ `: without it the backslash
 * would escape whatever follows (`&`, `\\`, or the closing `$$`).
 */
export function trimTex(text: string): string {
	const trimmed = text.trim();
	const backslashes = /\\*$/.exec(trimmed)![0].length;
	return backslashes % 2 === 1 && trimmed.length < text.trimStart().length ? `${trimmed} ` : trimmed;
}

/** One line of math: spaces collapsed, text arguments kept exactly. */
function flat(nodes: readonly Node[]): string {
	let out = "";
	for (let n = 0; n < nodes.length; n++) {
		const node = nodes[n]!;
		if (node.kind === "token") {
			const token = node.token;
			// A comment runs to the end of its line; joining lines would comment out what follows.
			if (token.kind === "comment") throw new Unformattable();
			if (token.kind === "space") out += " ";
			else out += token.text;
			if (token.kind === "command" && TEXT_COMMANDS.has(token.text) && nodes[n + 1]?.kind === "group") {
				out += serialize([nodes[n + 1]!]);
				n++;
			}
		} else if (node.kind === "group") {
			out += `{${flat(node.children)}}`;
		} else {
			throw new Unformattable(); // environments are laid out by `layout`
		}
	}
	// Each run of spaces is one token, so it is already a single space; text arguments are kept as written.
	return out;
}

function hasEnv(nodes: readonly Node[]): boolean {
	return nodes.some((node) => node.kind === "env" || (node.kind === "group" && hasEnv(node.children)));
}

/** Split an environment body at row separators and `&`, at its own level only. */
function rows(body: readonly Node[]): {cells: Node[][]; separator: string}[] {
	const result: {cells: Node[][]; separator: string}[] = [];
	let cells: Node[][] = [[]];
	for (const node of body) {
		if (node.kind === "token" && node.token.kind === "rowsep") {
			result.push({cells, separator: node.token.text});
			cells = [[]];
		} else if (node.kind === "token" && node.token.kind === "align") {
			cells.push([]);
		} else {
			cells[cells.length - 1]!.push(node);
		}
	}
	result.push({cells, separator: ""});
	return result;
}

const RULES = /^(\\hline|\\hdashline)\s*/;

/** Lay out nodes as lines at `indent`. */
function layout(nodes: readonly Node[], indent: string, unit: string): string[] {
	const lines: string[] = [];
	let pending: Node[] = [];
	const flush = () => {
		const text = trimTex(flat(pending));
		if (text) lines.push(indent + text);
		pending = [];
	};
	for (const node of nodes) {
		if (node.kind !== "env") {
			// A group with an environment inside (rare) cannot be laid out line by line.
			if (node.kind === "group" && hasEnv(node.children)) throw new Unformattable();
			pending.push(node);
			continue;
		}
		if (node.body.some((child) => child.kind === "token" && child.token.kind === "comment")) throw new Unformattable();
		// Text before the environment stays on the \begin line: "f(x) = \begin{cases}".
		const lead = trimTex(flat(pending));
		pending = [];
		lines.push(`${indent}${lead ? `${lead} ` : ""}\\begin{${node.name}}${node.args}`);
		lines.push(...environmentBody(node.body, indent + unit, unit));
		lines.push(`${indent}\\end{${node.name}}`);
	}
	flush();
	return lines;
}

function environmentBody(body: readonly Node[], indent: string, unit: string): string[] {
	const all = rows(body);
	// A final separator with nothing after it is kept as written (it can add an empty row), but gets no line.
	const last = all[all.length - 1]!;
	if (all.length > 1 && last.cells.length === 1 && flat(last.cells[0]!).trim() === "") all.pop();

	const nested = all.some((row) => row.cells.some(hasEnv));
	if (nested) {
		// Rows with environments inside: indent, one row per line, no column alignment.
		const lines: string[] = [];
		for (const row of all) {
			const parts = row.cells.map((cell) => layout(cell, indent, unit));
			const joined: string[] = [];
			parts.forEach((cellLines, c) => {
				if (c > 0) {
					const previous = joined.pop() ?? indent;
					joined.push(`${previous} &${cellLines.length ? ` ${cellLines[0]!.trimStart()}` : ""}`);
					joined.push(...cellLines.slice(1));
				} else {
					joined.push(...cellLines);
				}
			});
			if (row.separator && joined.length) joined[joined.length - 1] += ` ${row.separator}`;
			lines.push(...joined);
		}
		return lines;
	}

	const table = all.map((row) => ({
		cells: row.cells.map((cell) => trimTex(flat(cell))),
		separator: row.separator,
	}));
	// Move \hline at the start of a row onto its own line so it does not widen the first column.
	const lines: string[] = [];
	const ruleBefore = table.map((row) => {
		const match = RULES.exec(row.cells[0] ?? "");
		if (!match) return null;
		row.cells[0] = row.cells[0]!.slice(match[0].length);
		return match[1]!;
	});
	const columns = Math.max(...table.map((row) => row.cells.length));
	const widths = Array.from({length: columns}, (_, c) => Math.max(0, ...table.filter((row) => row.cells.length > 1).map((row) => [...(row.cells[c] ?? "")].length)));
	table.forEach((row, r) => {
		if (ruleBefore[r]) lines.push(indent + ruleBefore[r]);
		const onlyRule = row.cells.length === 1 && row.cells[0] === "" && ruleBefore[r];
		if (onlyRule && !row.separator) return;
		const padded = row.cells.map((cell, c) => (c < row.cells.length - 1 ? cell.padEnd(widths[c]! + cell.length - [...cell].length) : cell));
		const text = padded.join(" & ").trimEnd();
		lines.push(`${indent}${text}${row.separator ? `${text ? " " : ""}${row.separator}` : ""}`);
	});
	return lines;
}

/**
 * Format the TeX inside a display math block (without the `$$`). `unit` is one level of indentation.
 * Returns the input unchanged if it cannot be formatted safely.
 */
export function formatMath(source: string, unit = "\t"): string {
	try {
		const nodes = parse(tokenize(source));
		if (!nodes.some((node) => node.kind === "env")) {
			// No environment: one line, spaces collapsed. Comments end at the line end, so keep those as they are.
			if (nodes.some((node) => node.kind === "token" && node.token.kind === "comment")) return source;
			return trimTex(flat(nodes));
		}
		return layout(nodes, "", unit).join("\n");
	} catch (error) {
		if (error instanceof Unformattable) return source;
		throw error;
	}
}
