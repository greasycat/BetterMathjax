import {isBare} from "./custom-symbols";
import type {ResolvedSymbol, SymbolEntry} from "./types";

function toList(value: string | string[] | undefined): string[] {
	if (value === undefined) return [];
	const list = Array.isArray(value) ? value : [value];
	return list.filter((item) => typeof item === "string" && item.trim() !== "");
}

export function symbolKey(name: string): string {
	return name.startsWith("\\") ? name.slice(1) : name;
}

function resolve(entry: SymbolEntry, source: ResolvedSymbol["source"]): ResolvedSymbol {
	return {
		name: entry.name,
		key: symbolKey(entry.name),
		description: toList(entry.description),
		examples: toList(entry.examples),
		seeAlso: toList(entry.see_also),
		snippet: typeof entry.snippet === "string" ? entry.snippet : "",
		preview: entry.preview !== false,
		disabled: entry.disabled === true,
		package: typeof entry.package === "string" ? entry.package : null,
		source,
	};
}

/** Non-empty fields of the user entry win; empty ones fall back to the built-in entry. */
function merge(base: ResolvedSymbol, user: ResolvedSymbol): ResolvedSymbol {
	return {
		name: base.name,
		key: base.key,
		description: user.description.length ? user.description : base.description,
		examples: user.examples.length ? user.examples : base.examples,
		seeAlso: user.seeAlso.length ? user.seeAlso : base.seeAlso,
		snippet: user.snippet !== "" ? user.snippet : base.snippet,
		// A user's own examples can make a preview possible where the built-in symbol had none.
		preview: user.examples.length ? user.preview : base.preview,
		disabled: user.disabled,
		package: base.package,
		// Only turning a built-in symbol off is not customizing it.
		source: isBare({name: user.name, description: user.description, examples: user.examples, see_also: user.seeAlso, snippet: user.snippet})
			? "builtin" : "override",
	};
}

/** Holds the built-in symbols plus the user's overrides and serves the merged view. */
export class SymbolRegistry {
	private readonly builtin: Map<string, ResolvedSymbol>;
	private merged: Map<string, ResolvedSymbol>;
	private list: ResolvedSymbol[];
	private enabledList: ResolvedSymbol[];
	private user = new Map<string, SymbolEntry>();
	private readonly listeners = new Set<() => void>();

	constructor(builtin: SymbolEntry[]) {
		this.builtin = new Map(builtin.map((entry) => [entry.name, resolve(entry, "builtin")]));
		this.merged = this.builtin;
		this.list = Array.from(this.builtin.values());
		this.enabledList = this.list;
	}

	setUserEntries(entries: SymbolEntry[]): void {
		this.user = new Map(entries.map((entry) => [entry.name, entry]));
		const merged = new Map(this.builtin);
		for (const entry of entries) {
			const user = resolve(entry, "user");
			const base = merged.get(entry.name);
			merged.set(entry.name, base ? merge(base, user) : user);
		}
		this.merged = merged;
		this.list = Array.from(merged.values());
		this.enabledList = this.list.filter((symbol) => !symbol.disabled);
		for (const listener of this.listeners) listener();
	}

	/** Call `listener` whenever the user entries change. Returns the unsubscribe function. */
	subscribe(listener: () => void): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	get(name: string): ResolvedSymbol | undefined {
		return this.merged.get(name);
	}

	/** The built-in definition, ignoring user overrides. */
	builtinSymbol(name: string): ResolvedSymbol | undefined {
		return this.builtin.get(name);
	}

	/** The user's own entry as stored, before merging. */
	userEntry(name: string): SymbolEntry | undefined {
		return this.user.get(name);
	}

	get userCount(): number {
		return this.user.size;
	}

	all(): readonly ResolvedSymbol[] {
		return this.list;
	}

	/** The symbols that may be suggested: everything the user has not disabled. */
	enabled(): readonly ResolvedSymbol[] {
		return this.enabledList;
	}

	/** Packages of the built-in symbols, for filtering, sorted by name. */
	packages(): string[] {
		return [...new Set(this.list.map((symbol) => symbol.package).filter((name): name is string => name !== null))].sort();
	}
}

/** Keeps entries that are objects with a non-empty string name; drops everything else. */
export function sanitizeEntries(raw: unknown): SymbolEntry[] {
	if (!Array.isArray(raw)) return [];
	return raw.filter((item): item is SymbolEntry =>
		typeof item === "object" && item !== null &&
		typeof (item as SymbolEntry).name === "string" && (item as SymbolEntry).name !== "");
}
