import {MathJaxSymbol} from "./mathjax-symbols";

export interface BetterMathjaxSettings {
	mySetting: string;
	useSnippet: boolean;
	suggestionNumber: number;
	alwaysShowExamples: boolean; // Always show example even when not provided, this may lead to mathjax rendering issues

	autoEnabling: boolean; // enable the autocompletion automatically when inside $ (inline) or $$ (multiple lines)
	forceEnabling: boolean; // always enable the autocompletion

	userDefinedSymbols: Map<string, MathJaxSymbol>;

}

export const DEFAULT_SETTINGS: BetterMathjaxSettings = {
	mySetting: 'default',
	useSnippet: true,
	suggestionNumber: 5,
	alwaysShowExamples: true,
	autoEnabling: true,
	forceEnabling: false,
	userDefinedSymbols: new Map<string, MathJaxSymbol>(),
}
