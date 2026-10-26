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

		constructor(view: EditorView) {
			this.inside = this.regionAtHead(view);
		}

		update(update: ViewUpdate): void {
			if (!enabled()) {
				this.inside = null;
				return;
			}
			if (update.docChanged || !update.selectionSet) {
				// Typing, or a new note: follow the cursor without formatting anything.
				if (update.docChanged || update.selectionSet) this.inside = this.regionAtHead(update.view);
				return;
			}
			const previous = this.inside;
			const head = update.state.selection.main.head;
			if (previous && (head < previous.start || head > previous.end)) {
				// Formatting changes the document, which CodeMirror does not allow during an update.
				const view = update.view;
				queueMicrotask(() => this.format(view, previous.start));
			}
			this.inside = this.regionAtHead(update.view);
		}

		private regionAtHead(view: EditorView): {start: number; end: number} | null {
			const region = regionAt(view.state.doc.toString(), view.state.selection.main.head);
			return region ? {start: region.start, end: region.end} : null;
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
		}
	});
}
