export const OBSIDIAN_TEX_PACKAGES: string[];
export function initMathJax(): Promise<unknown>;
/** null if `tex` renders, otherwise MathJax's error message. */
export function renderError(tex: string): Promise<string | null>;
/** MathML for `tex` without source annotations, to compare what two inputs render to. */
export function mathml(tex: string): Promise<string>;
