export const OBSIDIAN_TEX_PACKAGES: string[];
export function initMathJax(): Promise<unknown>;
/** null if `tex` renders, otherwise MathJax's error message. */
export function renderError(tex: string): Promise<string | null>;
