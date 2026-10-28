import {EditorState, type TransactionSpec} from "@codemirror/state";
import {describe, expect, it} from "vitest";
import {mathScanField} from "../src/editor/math-scan-cache";
import {newlineWithoutIndent} from "../src/editor/no-indent";
import {formatMath} from "../src/format/tex-format";

/** Press Enter at `|` and return the document with the new cursor, or null when the key is passed on. */
function enter(doc: string): string | null {
	const cursor = doc.indexOf("|");
	const fake = {
		state: EditorState.create({doc: doc.replace("|", ""), selection: {anchor: cursor}, extensions: mathScanField}),
		dispatch(spec: TransactionSpec) {
			this.state = this.state.update(spec).state;
		},
	};
	const view = fake as unknown as Parameters<typeof newlineWithoutIndent>[0] & typeof fake;
	if (!newlineWithoutIndent(view)) return null;
	const head = view.state.selection.main.head;
	const text = view.state.doc.toString();
	return text.slice(0, head) + "|" + text.slice(head);
}

describe("math without indentation", () => {
	it("starts a new line in math without the indentation of the line above", () => {
		expect(enter("$$\n\\begin{cases}\n\tx & 1|\n\\end{cases}\n$$")).toBe("$$\n\\begin{cases}\n\tx & 1\n|\n\\end{cases}\n$$");
	});

	it("keeps the blockquote and list prefix of the line that opens the math", () => {
		expect(enter("> [!note]\n> $$\n> \ta|\n> $$")).toBe("> [!note]\n> $$\n> \ta\n> |\n> $$");
		expect(enter("- item\n  $$\n      a|\n  $$")).toBe("- item\n  $$\n      a\n  |\n  $$");
		expect(enter("- $$a|\n  $$")).toBe("- $$a\n  |\n  $$");
	});

	it("passes Enter on outside math", () => {
		expect(enter("text|")).toBeNull();
		expect(enter("$$a$$ b|")).toBeNull();
	});

	it("formats environments without indentation when the unit is empty", () => {
		expect(formatMath("\\begin{cases} x & 1 \\\\ yy & 2 \\end{cases}", "")).toBe("\\begin{cases}\nx  & 1 \\\\\nyy & 2\n\\end{cases}");
	});
});
