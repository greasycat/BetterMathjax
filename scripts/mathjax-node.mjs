// Shared MathJax setup for the registry scripts and tests: the same version and TeX packages as Obsidian,
// minus noerrors/noundefined, so that mistakes produce <merror> instead of being drawn as red text.
import MathJax from "mathjax";

export const OBSIDIAN_TEX_PACKAGES = [
	"base", "ams", "newcommand", "textmacros", "require", "autoload", "configmacros", "action", "amscd", "bbox",
	"boldsymbol", "braket", "bussproofs", "cancel", "cases", "centernot", "color", "colortbl", "empheq", "enclose",
	"extpfeil", "gensymb", "html", "mathtools", "mhchem", "tagformat", "textcomp", "unicode", "upgreek", "verb",
];

let ready = null;

export function initMathJax() {
	// input/tex already contains base, ams, newcommand, textmacros, require, autoload and configmacros.
	const bundled = new Set(["base", "ams", "newcommand", "textmacros", "require", "autoload", "configmacros"]);
	ready ??= MathJax.init({
		loader: {load: ["input/tex", ...OBSIDIAN_TEX_PACKAGES.filter((name) => !bundled.has(name)).map((name) => `[tex]/${name}`)]},
		tex: {packages: OBSIDIAN_TEX_PACKAGES},
	}).then(() => MathJax);
	return ready;
}

/** null if `tex` renders, otherwise MathJax's error message. */
export async function renderError(tex) {
	const mj = await initMathJax();
	try {
		// Labels and equation numbers are global; reset them so one check cannot affect the next.
		mj.texReset();
		const mml = mj.tex2mml(tex, {display: true});
		const match = /<merror[^>]*data-mjx-error="([^"]*)"|<merror[^>]*>[\s\S]*?<mtext>([^<]*)<\/mtext>/.exec(mml);
		if (match) return match[1] ?? match[2] ?? "error";
		// Undefined commands are not errors in MathJax: they are drawn as their own name in red.
		const undefinedCommand = /<mtext mathcolor="red" data-latex="(\\[^"]*)">\1<\/mtext>/.exec(mml);
		return undefinedCommand ? `Undefined control sequence ${undefinedCommand[1]}` : null;
	} catch (error) {
		return String(error?.message ?? error);
	}
}

/** MathML for `tex` without source annotations, to compare what two inputs render to. */
export async function mathml(tex) {
	const mj = await initMathJax();
	mj.texReset();
	return mj.tex2mml(tex, {display: true}).replace(/ data-latex(-item)?="[^"]*"/g, "").replace(/>\s+</g, "><").trim();
}
