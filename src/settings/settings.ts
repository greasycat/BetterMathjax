import {sanitizeEntries} from "../symbols/registry";
import type {SymbolEntry} from "../symbols/types";

export type SymbolStorage = "hidden" | "note";

export type ActivationMode = "math" | "always";

export interface BetterMathjaxSettings {
	/** Where completion is offered: only inside `$…$` / `$$…$$`, or everywhere. */
	activation: ActivationMode;
	/** Only `\\command` and `\\begin{…` open suggestions. Off: in math, a bare word also suggests environments. */
	requireBackslash: boolean;
	/** Format a math block automatically when the cursor leaves it. */
	formatOnLeave: boolean;
	/** Insert a symbol's snippet instead of its bare name when it has one. */
	useSnippetFirst: boolean;
	maxSuggestions: number;
	/** Tab accepts the highlighted suggestion, in addition to Enter. */
	acceptWithTab: boolean;
	/** Tab / Shift+Tab move between snippet fields. When off, the placeholder hotkeys are the only way. */
	tabJumpsFields: boolean;
	/** Render the symbol itself as a preview when it has no example. */
	previewWithoutExample: boolean;
	/** Typing `_` or `^` in math inserts `_{}` or `^{}` with the cursor inside. */
	autoBraceSubscript: boolean;
	autoBraceSuperscript: boolean;
	/** Where custom symbols live: the plugin data (hidden) or a note in the vault (visible to people and agents). */
	symbolStorage: SymbolStorage;
	/** The user's own symbols and overrides of built-in ones, when `symbolStorage` is "hidden". */
	customSymbols: SymbolEntry[];
	/** Vault path of the symbol note, when `symbolStorage` is "note". */
	symbolNotePath: string;
	/** The user closed the hotkey guide at the top of the settings tab. */
	hotkeyGuideDismissed: boolean;
}

export const DEFAULT_SETTINGS: BetterMathjaxSettings = {
	activation: "math",
	requireBackslash: false,
	formatOnLeave: false,
	useSnippetFirst: true,
	maxSuggestions: 5,
	acceptWithTab: true,
	tabJumpsFields: true,
	previewWithoutExample: true,
	autoBraceSubscript: true,
	autoBraceSuperscript: true,
	symbolStorage: "hidden",
	customSymbols: [],
	symbolNotePath: "Better MathJax Symbols.md",
	hotkeyGuideDismissed: false,
};

/** Keys used by 1.x, read once so existing users keep their choices. */
interface LegacySettings {
	forceEnabling?: boolean;
	autoEnabling?: boolean;
	maxSuggestionNumber?: number;
	alwaysShowExamples?: boolean;
	matchingSubScript?: boolean;
	matchingSuperScript?: boolean;
	userDefineSymbolFilePath?: string;
	/** Used by 2.0 development builds before symbols moved into the plugin data. */
	symbolFilePath?: string;
}

function pick<K extends keyof BetterMathjaxSettings>(
	data: Record<string, unknown>, key: K, check: (value: unknown) => boolean,
): BetterMathjaxSettings[K] | undefined {
	return check(data[key]) ? data[key] as BetterMathjaxSettings[K] : undefined;
}

const isBool = (value: unknown) => typeof value === "boolean";
const isString = (value: unknown) => typeof value === "string" && value.trim() !== "";
const isCount = (value: unknown) => typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 50;

/** Build valid settings from whatever `loadData()` returned, including 1.x data. */
export function migrateSettings(stored: unknown): BetterMathjaxSettings {
	const data = (typeof stored === "object" && stored !== null ? stored : {}) as Record<string, unknown>;
	const legacy = data as LegacySettings;

	const legacyActivation: ActivationMode | undefined =
		legacy.forceEnabling === true ? "always" : legacy.forceEnabling === false ? "math" : undefined;

	return {
		activation: pick(data, "activation", (v) => v === "math" || v === "always") ?? legacyActivation ?? DEFAULT_SETTINGS.activation,
		// `bareEnvironments` comes from a development build with the opposite meaning.
		requireBackslash: pick(data, "requireBackslash", isBool)
			?? (typeof data.bareEnvironments === "boolean" ? !data.bareEnvironments : DEFAULT_SETTINGS.requireBackslash),
		formatOnLeave: pick(data, "formatOnLeave", isBool) ?? DEFAULT_SETTINGS.formatOnLeave,
		useSnippetFirst: pick(data, "useSnippetFirst", isBool) ?? DEFAULT_SETTINGS.useSnippetFirst,
		maxSuggestions: pick(data, "maxSuggestions", isCount)
			?? (isCount(legacy.maxSuggestionNumber) ? legacy.maxSuggestionNumber! : DEFAULT_SETTINGS.maxSuggestions),
		acceptWithTab: pick(data, "acceptWithTab", isBool) ?? DEFAULT_SETTINGS.acceptWithTab,
		// `fieldJumpKey` comes from a development build that allowed other keys; anything but Tab means hotkeys.
		tabJumpsFields: pick(data, "tabJumpsFields", isBool)
			?? (typeof data.fieldJumpKey === "string" ? data.fieldJumpKey === "Tab" : DEFAULT_SETTINGS.tabJumpsFields),
		previewWithoutExample: pick(data, "previewWithoutExample", isBool)
			?? (isBool(legacy.alwaysShowExamples) ? legacy.alwaysShowExamples : DEFAULT_SETTINGS.previewWithoutExample),
		autoBraceSubscript: pick(data, "autoBraceSubscript", isBool)
			?? (isBool(legacy.matchingSubScript) ? legacy.matchingSubScript : DEFAULT_SETTINGS.autoBraceSubscript),
		autoBraceSuperscript: pick(data, "autoBraceSuperscript", isBool)
			?? (isBool(legacy.matchingSuperScript) ? legacy.matchingSuperScript : DEFAULT_SETTINGS.autoBraceSuperscript),
		symbolStorage: pick(data, "symbolStorage", (v) => v === "hidden" || v === "note") ?? DEFAULT_SETTINGS.symbolStorage,
		customSymbols: sanitizeEntries(data.customSymbols),
		symbolNotePath: pick(data, "symbolNotePath", (v) => isString(v) && (v as string).trim().endsWith(".md"))
			?? DEFAULT_SETTINGS.symbolNotePath,
		hotkeyGuideDismissed: pick(data, "hotkeyGuideDismissed", isBool) ?? DEFAULT_SETTINGS.hotkeyGuideDismissed,
	};
}

/** Where symbol notes used to live by default. */
export const LEGACY_SYMBOL_NOTE = "symbols.md";

/**
 * Vault paths of symbol notes to import from, most specific first, or `null` if the stored data already
 * has `customSymbols` (migration done, or a fresh install that has saved once).
 */
export function legacySymbolNotePaths(stored: unknown): string[] | null {
	const data = (typeof stored === "object" && stored !== null ? stored : {}) as Record<string, unknown> & LegacySettings;
	if (Array.isArray(data.customSymbols)) return null;
	const paths = [data.symbolFilePath, data.userDefineSymbolFilePath, LEGACY_SYMBOL_NOTE]
		.filter((path): path is string => isString(path))
		.map((path) => path.trim());
	return [...new Set(paths)];
}
