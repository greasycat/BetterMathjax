import type {EditorSuggest} from "obsidian";

/**
 * Obsidian does not expose the selected row of an EditorSuggest. These helpers reach into the
 * undocumented `suggestions` field and fail softly when it changes shape.
 */
interface SuggestionList {
	selectedItem: number;
	values: unknown[];
	setSelectedItem(index: number, event: Event | null): void;
}

function list(suggest: EditorSuggest<unknown>): SuggestionList | null {
	const candidate = (suggest as unknown as {suggestions?: Partial<SuggestionList>}).suggestions;
	if (!candidate || typeof candidate.selectedItem !== "number" ||
		!Array.isArray(candidate.values) || typeof candidate.setSelectedItem !== "function") {
		return null;
	}
	return candidate as SuggestionList;
}

export function selectedIndex(suggest: EditorSuggest<unknown>): number | null {
	return list(suggest)?.selectedItem ?? null;
}

/** Move the highlighted row by `delta`, wrapping around. Returns false if the internals are unavailable. */
export function moveSelection(suggest: EditorSuggest<unknown>, delta: number): boolean {
	const suggestions = list(suggest);
	if (!suggestions || suggestions.values.length === 0) return false;
	const count = suggestions.values.length;
	suggestions.setSelectedItem((((suggestions.selectedItem + delta) % count) + count) % count, new KeyboardEvent("keydown"));
	return true;
}
