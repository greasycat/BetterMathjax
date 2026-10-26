import type {Extension} from "@codemirror/state";
import {ViewPlugin, type EditorView, type ViewUpdate} from "@codemirror/view";
import {formatRegion, regionAt} from "../format/format-note";

/**
 * Format a math block when the cursor moves out of it. Only a pure cursor move counts (arrow keys, a click,
 * a jump): when typing carries the cursor out, or the note is switched, nothing is formatted.
 */
export function formatOnLeaveExtension(enabled: () => boolean, indentUnit: () => string): Extension {
	return ViewPlugin.fromClass(class {
		/** The block the cursor was in, as offsets in the current document. */
		private inside: {start: number; end: number} | null = null;
		/** Set by typing: `inside` is looked up again at `head` before it is next needed. */
		private stale = false;
		private head = 0;

		constructor(view: EditorView) {
			this.inside = this.regionAtHead(view);
			this.head = view.state.selection.main.head;
		}

		update(update: ViewUpdate): void {
			if (!enabled()) {
				this.inside = null;
				this.stale = false;
				return;
			}
			if (update.docChanged || !update.selectionSet) {
				// Typing, or a new note: follow the cursor without formatting anything. Scanning the note on
				// every keystroke is wasted work, so the block is found again only when the cursor moves.
				if (update.docChanged || update.selectionSet) {
					this.stale = true;
					this.head = update.state.selection.main.head;
				}
				return;
			}
			// Where the cursor was before this move. The document did not change in this update.
			const previous = this.stale ? this.regionAt(update.view, this.head) : this.inside;
			this.stale = false;
			const head = update.state.selection.main.head;
			if (previous && (head < previous.start || head > previous.end)) {
				// Formatting changes the document, which CodeMirror does not allow during an update.
				const view = update.view;
				queueMicrotask(() => this.format(view, previous.start));
			}
			this.inside = this.regionAtHead(update.view);
			this.head = head;
		}

		private regionAt(view: EditorView, offset: number): {start: number; end: number} | null {
			const region = regionAt(view.state.doc.toString(), offset);
			return region ? {start: region.start, end: region.end} : null;
		}

		private regionAtHead(view: EditorView): {start: number; end: number} | null {
			return this.regionAt(view, view.state.selection.main.head);
		}

		private format(view: EditorView, start: number): void {
			const text = view.state.doc.toString();
			// Look the block up again: the document may have changed since the cursor left it.
			const region = regionAt(text, start);
			if (!region || region.start !== start) return;
			const head = view.state.selection.main.head;
			if (head >= region.start && head <= region.end) return; // back inside: leave it for now
			const change = formatRegion(text, region, indentUnit());
			if (!change) return;
			view.dispatch({changes: {from: change.from, to: change.to, insert: change.insert}, userEvent: "format"});
			this.inside = this.regionAtHead(view);
			this.stale = false;
			this.head = view.state.selection.main.head;
		}
	});
}
