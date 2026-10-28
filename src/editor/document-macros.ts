import {StateField, type ChangeSet, type EditorState, type Text} from "@codemirror/state";
import {scanMath} from "../math/context";
import {MAY_DEFINE, parseMacros, type MacroDef} from "../math/macros";

const DEFINERS = new RegExp(MAY_DEFINE.source, "g");

/**
 * The macro definitions of one document. They are parsed only when asked for, and parsed again only after an
 * edit that may change them, so ordinary typing costs one regex test per change.
 *
 * An edit that moves a math delimiter does not count, so a definition that leaves or enters math that way is
 * seen only after the next edit that counts.
 */
class DocumentMacros {
	/** The text has a definer that did not parse, such as one that is not finished yet. */
	private pending = false;

	constructor(private readonly doc: Text, private defs: MacroDef[] | null) {}

	static create(doc: Text): DocumentMacros {
		return new DocumentMacros(doc, null);
	}

	get(): readonly MacroDef[] {
		if (this.defs === null) {
			const text = this.doc.toString();
			const definers = text.match(DEFINERS)?.length ?? 0;
			this.defs = definers ? parseMacros(text, scanMath(text).regions) : [];
			this.pending = definers > this.defs.length;
		}
		return this.defs;
	}

	/** The 1-based line of a definition. */
	line(def: MacroDef): number {
		return this.doc.lineAt(def.from).number;
	}

	/** The cache after `changes`, which turn `startDoc` into `doc`. */
	after(doc: Text, startDoc: Text, changes: ChangeSet): DocumentMacros {
		const defs = this.defs;
		// Any edit can finish a definer that did not parse, for example by adding its closing brace.
		if (defs === null || this.pending) return new DocumentMacros(doc, null);
		let touched = false;
		changes.iterChangedRanges((fromA, toA, fromB, toB) => {
			touched ||= defs.some((def) => def.from <= toA && fromA <= def.to) ||
				MAY_DEFINE.test(lines(startDoc, fromA, toA)) || MAY_DEFINE.test(lines(doc, fromB, toB));
		});
		if (touched) return new DocumentMacros(doc, null);
		return new DocumentMacros(doc, defs.map((def) => ({...def, from: changes.mapPos(def.from), to: changes.mapPos(def.to)})));
	}
}

/** The full lines that hold `from`…`to`, so a definer split by the edit is still seen. */
function lines(doc: Text, from: number, to: number): string {
	return doc.sliceString(doc.lineAt(from).from, doc.lineAt(to).to);
}

export const documentMacrosField = StateField.define<DocumentMacros>({
	create: (state) => DocumentMacros.create(state.doc),
	update(macros, tr) {
		if (!tr.docChanged) return macros;
		return macros.after(tr.state.doc, tr.startState.doc, tr.changes);
	},
});

export function macrosInState(state: EditorState): {defs: readonly MacroDef[]; line: (def: MacroDef) => number} {
	const macros = state.field(documentMacrosField, false) ?? DocumentMacros.create(state.doc);
	return {defs: macros.get(), line: (def) => macros.line(def)};
}
