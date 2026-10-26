import {debounce, normalizePath, Notice, parseYaml, TAbstractFile, TFile} from "obsidian";
import type BetterMathjaxPlugin from "../main";
import type {SymbolStorage} from "../settings/settings";
import {cleanEntry, isBare, mergeEntries, removeEntry, setDisabledEntries, upsertEntry} from "./custom-symbols";
import {backupFileName, backupsToPrune, isRedundant, overwrites, parseBackup, type Backup} from "./backups";
import {parseJsonlNote, removeFromNote, replaceAllInNote, upsertInNote} from "./jsonl-note";
import {parseLegacyNote} from "./legacy-note";
import type {SymbolEntry} from "./types";

type ImportStatus = "imported" | "missing" | "empty" | "invalid";

/**
 * Owns the custom symbols, wherever they live:
 * - "hidden": in the plugin data, edited only through the plugin.
 * - "note": in a jsonl block of a vault note, which people and their agents can also edit directly.
 * Keeps the registry in step either way.
 */
export class CustomSymbolStore {
	private noteEntries: SymbolEntry[] = [];
	/** The note as last read, so an outside edit can be backed up as the state before it. */
	private lastNoteContent: string | null = null;
	private latestBackup: Backup | null | undefined = undefined;
	private lastNoteProblems = "";
	private readonly reloadNoteSoon = debounce(() => void this.loadNote(), 300, true);

	constructor(private readonly plugin: BetterMathjaxPlugin) {}

	get storage(): SymbolStorage {
		return this.plugin.settings.symbolStorage;
	}

	get notePath(): string {
		return normalizePath(this.plugin.settings.symbolNotePath);
	}

	get entries(): readonly SymbolEntry[] {
		return this.storage === "note" ? this.noteEntries : this.plugin.settings.customSymbols;
	}

	/** Push the current entries into the registry. */
	apply(): void {
		this.plugin.registry.setUserEntries([...this.entries]);
	}

	/** Load from wherever the symbols live; call after the settings are (re)loaded. */
	async load(): Promise<void> {
		if (this.storage === "note") await this.loadNote();
		else this.apply();
	}

	/** Follow edits to the symbol note, including renames made in Obsidian. */
	watch(): void {
		const {vault} = this.plugin.app;
		const onChange = (file: TAbstractFile) => {
			if (this.storage === "note" && file.path === this.notePath) this.reloadNoteSoon();
		};
		this.plugin.registerEvent(vault.on("modify", onChange));
		this.plugin.registerEvent(vault.on("create", onChange));
		this.plugin.registerEvent(vault.on("delete", onChange));
		this.plugin.registerEvent(vault.on("rename", (file, oldPath) => {
			if (this.storage !== "note" || oldPath !== this.notePath) return;
			this.plugin.settings.symbolNotePath = file.path;
			void this.plugin.saveSettings();
			this.reloadNoteSoon();
		}));
	}

	private async loadNote(): Promise<void> {
		const file = this.plugin.app.vault.getFileByPath(this.notePath);
		const content = file ? await this.plugin.app.vault.cachedRead(file) : null;
		const result = content === null ? null : parseJsonlNote(content);
		// The plugin's own writes reload right away (see updateNote), so a difference here is an outside edit.
		// Back it up only if it changed or removed a symbol; an edit that only adds lines loses nothing.
		if (this.lastNoteContent !== null && content !== this.lastNoteContent && overwrites(this.noteEntries, result?.entries ?? [])) {
			await this.backup(`Before an outside edit of ${this.notePath}`, {
				kind: "outside-edit", storage: "note", entries: this.noteEntries, noteContent: this.lastNoteContent,
			});
		}
		this.lastNoteContent = content;
		this.noteEntries = result?.entries ?? [];
		this.apply();

		// Report problems once per distinct set, so saving a half-typed line does not repeat the notice.
		const problems = result?.errors.map((error) => `line ${error.line}: ${error.message}`).join("\n") ?? "";
		if (problems !== "" && problems !== this.lastNoteProblems) {
			new Notice(`Better MathJax: ${this.notePath} has lines that were skipped.\n${problems}`, 10000);
		}
		this.lastNoteProblems = problems;
	}

	private async updateNote(change: (content: string) => string): Promise<void> {
		const {vault} = this.plugin.app;
		const file = vault.getFileByPath(this.notePath);
		let written: string;
		if (file) {
			written = await vault.process(file, change);
		} else {
			const folder = this.notePath.includes("/") ? this.notePath.slice(0, this.notePath.lastIndexOf("/")) : "";
			if (folder !== "" && !vault.getFolderByPath(folder)) await vault.createFolder(folder);
			written = change("");
			await vault.create(this.notePath, written);
		}
		// Our own write is not an outside edit, so it must not trigger a backup when the note reloads.
		this.lastNoteContent = written;
		await this.loadNote();
	}

	private async commitHidden(entries: SymbolEntry[]): Promise<void> {
		this.plugin.settings.customSymbols = entries;
		await this.plugin.saveSettings();
		this.apply();
	}

	/** Add or replace a custom symbol. Pass `previousName` when the symbol is being renamed. */
	async save(entry: SymbolEntry, previousName?: string): Promise<void> {
		const renamed = previousName !== undefined && previousName !== entry.name.trim();
		const existing = this.entries.find((item) => item.name === (previousName ?? entry.name.trim()));
		// Saving without changes must not write anything, nor take a backup that would hide the next real one.
		if (!renamed && existing && JSON.stringify(cleanEntry(existing)) === JSON.stringify(cleanEntry(entry))) return;
		// For a built-in symbol, an entry that is only a name changes nothing: skip a new one, and remove an
		// existing one (e.g. a built-in symbol switched back on in the editor). A custom name alone still adds it.
		if (isBare(entry) && !renamed && this.plugin.registry.builtinSymbol(entry.name.trim())) {
			if (existing) await this.remove(existing.name);
			return;
		}
		if (overwrites(this.entries, upsertEntry(this.entries, entry, previousName))) {
			await this.backup(renamed ? `Before renaming ${previousName} to ${entry.name.trim()}` : `Before changing ${entry.name.trim()}`);
		}
		if (this.storage === "note") await this.updateNote((content) => upsertInNote(content, entry, previousName));
		else await this.commitHidden(upsertEntry(this.entries, entry, previousName));
	}

	/** Turn symbols off (`disabled`) or back on, as one change. Works for built-in and custom symbols. */
	async setDisabled(names: readonly string[], disabled: boolean): Promise<void> {
		const next = setDisabledEntries(this.entries, names, disabled, (name) => this.plugin.registry.builtinSymbol(name) !== undefined);
		if (JSON.stringify(next) === JSON.stringify(this.entries)) return;
		if (overwrites(this.entries, next)) {
			const what = names.length === 1 ? names[0] : `${names.length} symbols`;
			await this.backup(`Before ${disabled ? "disabling" : "enabling"} ${what}`);
		}
		if (this.storage === "hidden") {
			await this.commitHidden(next);
			return;
		}
		const byName = new Map(next.map((entry) => [entry.name, entry]));
		await this.updateNote((content) => names.reduce((text, name) => {
			const entry = byName.get(name);
			return entry ? upsertInNote(text, entry) : removeFromNote(text, name);
		}, content));
	}

	async remove(name: string): Promise<void> {
		if (!this.entries.some((entry) => entry.name === name)) return;
		await this.backup(`Before removing ${name}`);
		if (this.storage === "note") await this.updateNote((content) => removeFromNote(content, name));
		else await this.commitHidden(removeEntry(this.entries, name));
	}

	/**
	 * Switch where symbols are stored, moving them across. Into a note: symbols the note already has are kept,
	 * the rest are added. Out of a note: only when every line of it is valid; the note then goes to the trash.
	 * Throws, without changing anything, if the note has lines that cannot be read.
	 */
	async setStorage(storage: SymbolStorage): Promise<string> {
		if (storage === this.storage) return "";
		const {settings} = this.plugin;
		if (storage === "note") {
			const moving = [...settings.customSymbols];
			settings.symbolStorage = "note";
			this.lastNoteContent = null;
			let added: SymbolEntry[];
			try {
				await this.loadNote();
				const existing = new Set(this.noteEntries.map((entry) => entry.name));
				added = moving.filter((entry) => !existing.has(entry.name));
				// Where the note already has a symbol, its version wins. Back up the hidden ones if that loses any.
				// The backup holds only the hidden symbols, so restoring it puts those back, not the note's old text.
				if (overwrites(moving, [...this.noteEntries, ...added])) {
					await this.backup(`Before moving symbols into ${this.notePath}`, {storage: "hidden", entries: moving});
				}
				if (added.length > 0 || !this.plugin.app.vault.getFileByPath(this.notePath)) {
					await this.updateNote((content) => added.reduce((text, entry) => upsertInNote(text, entry), content));
				}
			} catch (error) {
				// Nothing was saved yet: go back to the hidden symbols.
				settings.symbolStorage = "hidden";
				this.lastNoteContent = null;
				this.noteEntries = [];
				this.apply();
				throw error;
			}
			settings.customSymbols = [];
			await this.plugin.saveSettings();
			const kept = moving.length - added.length;
			return `Symbols are now in ${this.notePath}${kept ? ` (${kept} already there were kept as written)` : ""}.`;
		}
		// Leaving the note: move its symbols only if every line can be read, then send the note to the trash.
		const {vault, fileManager} = this.plugin.app;
		const file = vault.getFileByPath(this.notePath);
		const parsed = file ? parseJsonlNote(await vault.read(file)) : null;
		if (parsed && parsed.errors.length > 0) {
			const lines = parsed.errors.map((error) => `line ${error.line}: ${error.message}`).join("\n");
			throw new Error(`${this.notePath} has lines that could not be read, so nothing was moved and the note was kept. Fix them and try again.\n${lines}`);
		}
		settings.customSymbols = [...(parsed?.entries ?? this.noteEntries)];
		settings.symbolStorage = "hidden";
		this.lastNoteContent = null;
		await this.plugin.saveSettings();
		this.apply();
		if (!file) return "Symbols are now stored with the plugin settings.";
		await fileManager.trashFile(file);
		return `Moved ${settings.customSymbols.length} symbol${settings.customSymbols.length === 1 ? "" : "s"} into the plugin settings and sent ${this.notePath} to the trash.`;
	}

	/** Use the note at `path` for the symbols. Not an outside edit, so no backup is taken. */
	async switchNote(path: string): Promise<void> {
		this.plugin.settings.symbolNotePath = path;
		await this.plugin.saveSettings();
		this.lastNoteContent = null;
		this.lastNoteProblems = "";
		await this.load();
	}

	get backupFolder(): string {
		const {app, manifest} = this.plugin;
		return normalizePath(`${app.vault.configDir}/plugins/${manifest.id}/backups`);
	}

	/**
	 * Save the current symbols (or the state described by `state`) as a backup in the plugin folder, unless it
	 * would repeat the latest one. Old backups beyond the limit are deleted. Never throws: a failed backup must
	 * not block the change, but it is reported.
	 */
	private async backup(reason: string, state: Partial<Backup> = {}): Promise<void> {
		const storage = state.storage ?? this.storage;
		const record: Backup = {
			version: 1,
			createdAt: new Date().toISOString(),
			reason,
			kind: state.kind ?? "change",
			storage,
			entries: [...(state.entries ?? this.entries)],
			notePath: storage === "note" || state.noteContent !== undefined ? this.notePath : undefined,
			noteContent: "noteContent" in state ? state.noteContent : storage === "note" ? this.lastNoteContent ?? undefined : undefined,
		};
		try {
			if (this.latestBackup === undefined) this.latestBackup = (await this.listBackups())[0]?.backup ?? null;
			if (isRedundant(this.latestBackup, record)) return;
			const {adapter} = this.plugin.app.vault;
			if (!(await adapter.exists(this.backupFolder))) await adapter.mkdir(this.backupFolder);
			await adapter.write(`${this.backupFolder}/${backupFileName(new Date(record.createdAt))}`, JSON.stringify(record, null, 2));
			this.latestBackup = record;
			const names = (await adapter.list(this.backupFolder)).files.map((path) => path.slice(path.lastIndexOf("/") + 1));
			for (const name of backupsToPrune(names.filter((name) => name.endsWith(".json")))) await adapter.remove(`${this.backupFolder}/${name}`);
		} catch (error) {
			new Notice(`Better MathJax: could not save a backup (${error instanceof Error ? error.message : String(error)}).`, 8000);
		}
	}

	/** All backups, newest first. */
	async listBackups(): Promise<{path: string; backup: Backup}[]> {
		const {adapter} = this.plugin.app.vault;
		if (!(await adapter.exists(this.backupFolder))) return [];
		const files = (await adapter.list(this.backupFolder)).files.filter((path) => path.endsWith(".json")).sort().reverse();
		const result: {path: string; backup: Backup}[] = [];
		for (const path of files) {
			const backup = parseBackup(await adapter.read(path));
			if (backup) result.push({path, backup});
		}
		return result;
	}

	/** Delete one backup file. */
	async deleteBackup(path: string): Promise<void> {
		await this.plugin.app.vault.adapter.remove(path);
		// The cached latest backup may be the one just deleted; read it again next time.
		this.latestBackup = undefined;
	}

	/**
	 * Put the symbols of `backup` back into the current storage, after backing up what is there now. In a note,
	 * the note's full text is restored when the backup was taken from the same note; otherwise only its lines.
	 */
	async restore(backup: Backup): Promise<void> {
		if (overwrites(this.entries, backup.entries)) {
			await this.backup(`Before restoring the backup from ${new Date(backup.createdAt).toLocaleString()}`);
		}
		if (this.storage === "hidden") {
			await this.commitHidden([...backup.entries]);
			return;
		}
		const fullNote = backup.noteContent !== undefined && backup.notePath === this.notePath;
		await this.updateNote((content) => (fullNote ? backup.noteContent! : replaceAllInNote(content, backup.entries)));
	}

	/** Read a pre-2.0 symbol note at `path`, inside or outside the indexed vault. `null` if there is no such file. */
	private async readNote(path: string): Promise<string | null> {
		const {vault} = this.plugin.app;
		const file = vault.getFileByPath(path);
		if (file instanceof TFile) return vault.cachedRead(file);
		// Hidden paths (starting with a dot) are not indexed, so ask the adapter directly.
		const stat = await vault.adapter.stat(path);
		return stat?.type === "file" ? vault.adapter.read(path) : null;
	}

	/** Import symbols from a note: a jsonl block, or the json/yaml block used before 2.0. */
	async importNote(path: string): Promise<{status: ImportStatus; message: string}> {
		const normalized = normalizePath(path);
		if (this.storage === "note" && normalized === this.notePath) {
			return {status: "empty", message: `${normalized} is already your symbol note.`};
		}
		const content = await this.readNote(normalized);
		if (content === null) return {status: "missing", message: `${normalized} does not exist.`};

		let imported: SymbolEntry[];
		const jsonl = parseJsonlNote(content);
		if (jsonl.hasBlock) {
			imported = jsonl.entries;
		} else {
			const legacy = parseLegacyNote(content, {parse: parseYaml});
			if (!legacy.ok) return {status: "invalid", message: `Could not import ${normalized}: ${legacy.error}`};
			imported = legacy.entries;
		}
		if (imported.length === 0) return {status: "empty", message: `${normalized} has no JSONL, JSON or YAML block with symbols.`};

		const merged = mergeEntries(this.entries, imported);
		if (overwrites(this.entries, merged.list)) await this.backup(`Before importing from ${normalized}`);
		if (this.storage === "note") await this.updateNote((text) => imported.reduce((acc, entry) => upsertInNote(acc, entry), text));
		else await this.commitHidden(merged.list);
		const parts = [`${merged.added} added`, ...(merged.replaced ? [`${merged.replaced} replaced`] : [])];
		return {status: "imported", message: `Imported custom symbols from ${normalized}: ${parts.join(", ")}.`};
	}

	/**
	 * One-time move from the symbol note used before 2.0. Tries `paths` in order and stops at the first note
	 * that has symbols. The note itself is left untouched. Always marks the migration done.
	 */
	async migrateFromNotes(paths: string[]): Promise<void> {
		const {app, manifest} = this.plugin;
		const candidates = [...paths, `${app.vault.configDir}/plugins/${manifest.id}/symbols.md`];
		for (const path of candidates) {
			const result = await this.importNote(path);
			if (result.status === "imported") {
				new Notice(`Better MathJax: ${result.message} Custom symbols are now stored with the plugin settings, so the note is no longer used and can be deleted. To keep them in a note instead, choose "Note in your vault" in the plugin settings.`, 15000);
				break;
			}
			// A note that exists but cannot be read is worth reporting; a missing or empty one is not.
			if (result.status === "invalid") {
				new Notice(`Better MathJax: ${result.message} Fix it and use "Import from note" in the plugin settings.`, 15000);
				break;
			}
		}
		await this.plugin.saveSettings();
	}
}
