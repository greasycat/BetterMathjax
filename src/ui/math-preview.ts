import {finishRenderMath, renderMath} from "obsidian";

let flushQueued = false;

/** MathJax stylesheets must be flushed after rendering; batch that into one call per tick. */
function queueFlush(): void {
	if (flushQueued) return;
	flushQueued = true;
	window.setTimeout(() => {
		flushQueued = false;
		void finishRenderMath();
	}, 0);
}

/**
 * Render `source` as math into `el`. Returns false, and adds nothing, if MathJax is not ready or reports an
 * error: MathJax does not throw for bad TeX, it draws the error in red, which is no use as a preview.
 */
export function renderInlineMath(source: string, el: HTMLElement, display = false): boolean {
	try {
		const math = renderMath(source, display);
		if (math.querySelector("mjx-merror, [data-mjx-error]")) return false;
		el.appendChild(math);
		queueFlush();
		return true;
	} catch {
		return false;
	}
}
