import type {SymbolEntry} from "./types";

/** Pure operations on the list of custom symbols kept in the plugin data. Lists are never mutated. */

const OPTIONAL_FIELDS = ["description", "examples", "see_also", "snippet"] as const;

/** Whether an entry says nothing beyond its name, so keeping it would be noise. */
export function isBare(entry: SymbolEntry): boolean {
	const clean = cleanEntry(entry);
	return Object.keys(clean).length === 1;
}

function isEmpty(value: unknown): boolean {
	return value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
}

/** Copy of `entry` with a trimmed name and without empty fields, so they fall back to the built-in symbol. */
export function cleanEntry(entry: SymbolEntry): SymbolEntry {
	const clean: SymbolEntry = {name: entry.name.trim()};
	for (const field of OPTIONAL_FIELDS) {
		if (!isEmpty(entry[field])) (clean as unknown as Record<string, unknown>)[field] = entry[field];
	}
	if (entry.disabled === true) clean.disabled = true;
	return clean;
}

/**
 * Add `entry`, or replace the entry called `previousName` (default: `entry.name`) in place.
 * Throws when renaming onto another existing entry.
 */
export function upsertEntry(list: readonly SymbolEntry[], entry: SymbolEntry, previousName: string = entry.name): SymbolEntry[] {
	const clean = cleanEntry(entry);
	const index = list.findIndex((item) => item.name === previousName);
	if (previousName !== clean.name && list.some((item) => item.name === clean.name)) {
		throw new Error(`A custom symbol named ${clean.name} already exists.`);
	}
	if (index < 0) return [...list, clean];
	return list.map((item, i) => (i === index ? clean : item));
}

export function removeEntry(list: readonly SymbolEntry[], name: string): SymbolEntry[] {
	return list.filter((item) => item.name !== name);
}

/** Merge imported entries into `list`; an imported entry replaces an existing one with the same name. */
export function mergeEntries(list: readonly SymbolEntry[], imported: readonly SymbolEntry[]): {list: SymbolEntry[]; added: number; replaced: number} {
	let result = [...list];
	let added = 0;
	let replaced = 0;
	for (const entry of imported) {
		if (result.some((item) => item.name === entry.name.trim())) replaced++;
		else added++;
		result = upsertEntry(result, entry);
	}
	return {list: result, added, replaced};
}

/**
 * Turn symbols off or on. Disabling adds `disabled: true`, creating an entry for a built-in symbol if needed.
 * Enabling removes the flag, and removes an entry for a built-in symbol that is then just a name (a custom
 * symbol that is just a name still adds that name). Unchanged entries keep their place.
 */
export function setDisabledEntries(
	list: readonly SymbolEntry[], names: readonly string[], disabled: boolean, isBuiltin: (name: string) => boolean = () => true,
): SymbolEntry[] {
	const wanted = new Set(names);
	const result: SymbolEntry[] = [];
	for (const item of list) {
		if (!wanted.has(item.name)) {
			result.push(item);
			continue;
		}
		wanted.delete(item.name);
		const next = cleanEntry({...item, disabled});
		if (!isBare(next) || !isBuiltin(next.name)) result.push(next);
	}
	if (disabled) for (const name of wanted) result.push({name, disabled: true});
	return result;
}
