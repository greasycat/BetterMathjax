import {Prec, StateEffect, StateField, type EditorState, type Extension, type Transaction} from "@codemirror/state";
import {Decoration, EditorView, keymap, type DecorationSet} from "@codemirror/view";
import {orderFields, PLACEHOLDER, type Span} from "../snippet/placeholders";

/**
 * A snippet session remembers where the fields of an inserted snippet are and keeps them mapped through edits,
 * so a field stays jumpable after its `@1@` marker has been typed over. Sessions nest: a snippet inserted
 * inside a field of another one is handled first, then jumping continues in the outer one.
 *
 * A session ends when the cursor leaves the snippet, or when "next" is used on the last field once every
 * field has been filled in.
 */

interface Session {
	/** Fields in jump order (placeholder number, then position). */
	fields: Span[];
	/** The whole inserted snippet. */
	span: Span;
}

const startSession = StateEffect.define<Session>();
const endSession = StateEffect.define<null>();

function mapSpan(span: Span, tr: Transaction): Span {
	// Text typed at either edge of a field belongs to the field, so the range grows to include it.
	return {from: tr.changes.mapPos(span.from, -1), to: tr.changes.mapPos(span.to, 1)};
}

function contains(session: Session, pos: number): boolean {
	const to = Math.max(session.span.to, ...session.fields.map((field) => field.to));
	return pos >= session.span.from && pos <= to;
}

const sessions = StateField.define<Session[]>({
	create: () => [],
	update(stack, tr) {
		let next = stack;
		if (tr.docChanged) {
			// A change that crosses the edge of the snippet or of a field (replacing the whole note, deleting a
			// selection that covers part of a field) leaves nothing sensible to track, so it ends the snippet.
			// Typing inside a field, at its edges, or over exactly one field does not cross an edge.
			const crosses = (session: Session) => {
				const edges = [session.span.from, session.span.to, ...session.fields.flatMap((field) => [field.from, field.to])];
				let crossed = false;
				tr.changes.iterChangedRanges((fromA, toA) => {
					if (edges.some((edge) => fromA < edge && edge < toA)) crossed = true;
				});
				return crossed;
			};
			const kept: Session[] = [];
			for (const session of stack) {
				if (crosses(session)) break; // nested sessions inside it end with it
				kept.push({fields: session.fields.map((field) => mapSpan(field, tr)), span: mapSpan(session.span, tr)});
			}
			next = kept;
		}
		for (const effect of tr.effects) {
			if (effect.is(startSession)) next = [...next, effect.value];
			else if (effect.is(endSession)) next = next.slice(0, -1);
		}
		// Leaving a snippet ends it, and any snippet nested inside it.
		const head = tr.state.selection.main.head;
		while (next.length > 0 && !contains(next[next.length - 1]!, head)) next = next.slice(0, -1);
		return next;
	},
	provide: (field) => EditorView.decorations.from(field, (stack): DecorationSet => {
		const marks = stack.flatMap((session) => session.fields)
			.filter((field) => field.to > field.from)
			.sort((a, b) => a.from - b.from || a.to - b.to)
			.map((field) => fieldMark.range(field.from, field.to));
		return Decoration.set(marks, true);
	}),
});

const fieldMark = Decoration.mark({class: "better-mathjax-field"});

export function snippetSessionExtension(): Extension {
	return sessions;
}

/**
 * Tab moves to the next field and Shift+Tab to the previous one while a snippet is active. Outside a snippet,
 * or when `enabled()` says no (for example while the suggestion list is open and Tab should accept), the key
 * is passed on and keeps its normal behaviour. An Obsidian hotkey on Tab could not do this: it blocks the key
 * even when its command does nothing.
 */
export function snippetTabKeymap(enabled: () => boolean): Extension {
	const run = (direction: 1 | -1) => (view: EditorView) => enabled() && activeSession(view.state) !== null && jumpField(view, direction);
	return Prec.highest(keymap.of([
		{key: "Tab", run: run(1)},
		{key: "Shift-Tab", run: run(-1)},
	]));
}

/** The part of EditorView the session needs; lets tests drive it with a bare EditorState. */
export type SessionView = Pick<EditorView, "state" | "dispatch">;

/**
 * Replace `from…to` with `text` and start a session over its placeholders, selecting the first one.
 * With no placeholders, the cursor goes to the end of the text. Returns the new cursor offset.
 */
export function insertSnippet(view: SessionView, from: number, to: number, text: string): number {
	const fields = orderFields(text).map((field) => ({from: from + field.from, to: from + field.to}));
	const first = fields[0];
	view.dispatch({
		changes: {from, to, insert: text},
		selection: first ? {anchor: first.from, head: first.to} : {anchor: from + text.length},
		effects: first ? startSession.of({fields, span: {from, to: from + text.length}}) : [],
		userEvent: "input.complete",
		scrollIntoView: true,
	});
	return first ? first.to : from + text.length;
}

/** Fields of the innermost active session, in jump order (for tests and debugging). */
export function activeFields(state: EditorState): Span[] {
	return activeSession(state)?.fields ?? [];
}

function activeSession(state: EditorState): Session | null {
	const stack = state.field(sessions, false);
	return stack && stack.length > 0 ? stack[stack.length - 1]! : null;
}

function isFilled(state: EditorState, field: Span): boolean {
	return !new RegExp(`^(?:${PLACEHOLDER.source})$`).test(state.sliceDoc(field.from, field.to));
}

/** Index of the field the selection is in, or -1. */
function currentField(session: Session, state: EditorState): number {
	const {from, to} = state.selection.main;
	return session.fields.findIndex((field) => from >= field.from && to <= field.to);
}

/**
 * Move to the next (`direction` 1) or previous (-1) field of the innermost session.
 * Returns false when there is no session, so the caller can fall back to searching for markers.
 */
export function jumpField(view: SessionView, direction: 1 | -1): boolean {
	const {state} = view;
	const session = activeSession(state);
	if (!session) return false;

	const current = currentField(session, state);
	let target: number;
	if (current >= 0) {
		target = current + direction;
	} else {
		// Between fields: go to the nearest one in the jump direction, by position.
		const head = state.selection.main.head;
		const byPosition = session.fields.map((field, index) => ({field, index})).sort((a, b) => a.field.from - b.field.from);
		const found = direction === 1
			? byPosition.find((item) => item.field.from >= head)
			: [...byPosition].reverse().find((item) => item.field.to <= head);
		target = found ? found.index : direction === 1 ? session.fields.length : -1;
	}

	if (target < 0) return true;
	if (target >= session.fields.length) {
		// Past the last field: wrap to an unfilled one if any are left, otherwise leave the snippet.
		const unfilled = session.fields.findIndex((field) => !isFilled(state, field));
		if (unfilled >= 0) {
			select(view, session.fields[unfilled]!);
		} else {
			const end = Math.max(session.span.to, ...session.fields.map((field) => field.to));
			view.dispatch({selection: {anchor: end}, effects: endSession.of(null), scrollIntoView: true});
		}
		return true;
	}
	select(view, session.fields[target]!);
	return true;
}

function select(view: SessionView, field: Span): void {
	view.dispatch({selection: {anchor: field.from, head: field.to}, scrollIntoView: true});
}
