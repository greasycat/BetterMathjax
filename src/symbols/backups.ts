import type {SymbolStorage} from "../settings/settings";
import {cleanEntry} from "./custom-symbols";
import type {SymbolEntry} from "./types";

/** Pure helpers for custom-symbol backups. Reading and writing the files is done by the store. */

export interface Backup {
	version: 1;
	/** ISO time the backup was taken. */
	createdAt: string;
	/** Why it was taken, shown in the restore list, e.g. "Before saving \R". */
	reason: string;
	/** Groups backups from repeated outside edits so they can be coalesced. */
	kind: "change" | "outside-edit";
	storage: SymbolStorage;
	entries: SymbolEntry[];
	/** The symbol note as it was, when symbols lived in a note. */
	notePath?: string;
	noteContent?: string;
}

export const MAX_BACKUPS = 10;
/** Outside edits closer together than this share one backup: the state before the first of them. */
export const OUTSIDE_EDIT_WINDOW_MS = 2 * 60 * 1000;

/** Sortable, filesystem-safe name: 2026-10-25T21-43-54-123Z.json */
export function backupFileName(date: Date): string {
	return `${date.toISOString().replace(/[:.]/g, "-")}.json`;
}

function sameEntries(a: readonly SymbolEntry[], b: readonly SymbolEntry[]): boolean {
	return JSON.stringify(a.map(cleanEntry)) === JSON.stringify(b.map(cleanEntry));
}

/** Whether `next` adds nothing over `latest`, the most recent backup. */
export function isRedundant(latest: Backup | null, next: Backup): boolean {
	if (!latest) return false;
	if (sameEntries(latest.entries, next.entries) && latest.noteContent === next.noteContent) return true;
	return next.kind === "outside-edit" && latest.kind === "outside-edit"
		&& Date.parse(next.createdAt) - Date.parse(latest.createdAt) < OUTSIDE_EDIT_WINDOW_MS;
}

/** Names of backup files to delete so that only the newest `keep` remain. */
export function backupsToPrune(names: readonly string[], keep: number = MAX_BACKUPS): string[] {
	return [...names].sort().reverse().slice(keep);
}

/**
 * Whether going from `before` to `after` changes or removes an existing entry. Only adding new entries loses
 * nothing, so it does not need a backup.
 */
export function overwrites(before: readonly SymbolEntry[], after: readonly SymbolEntry[]): boolean {
	const next = new Map(after.map((entry) => [entry.name, JSON.stringify(cleanEntry(entry))]));
	return before.some((entry) => next.get(entry.name) !== JSON.stringify(cleanEntry(entry)));
}

export interface BackupDiff {
	added: string[];
	removed: string[];
	changed: string[];
}

/** What restoring `backup` would do to `current`. */
export function diffEntries(current: readonly SymbolEntry[], backup: readonly SymbolEntry[]): BackupDiff {
	const now = new Map(current.map((entry) => [entry.name, JSON.stringify(cleanEntry(entry))]));
	const then = new Map(backup.map((entry) => [entry.name, JSON.stringify(cleanEntry(entry))]));
	return {
		added: [...then.keys()].filter((name) => !now.has(name)),
		removed: [...now.keys()].filter((name) => !then.has(name)),
		changed: [...then.keys()].filter((name) => now.has(name) && now.get(name) !== then.get(name)),
	};
}

/** A backup file's content, or null if it is not one. */
export function parseBackup(text: string): Backup | null {
	try {
		const value = JSON.parse(text) as Partial<Backup>;
		if (value.version !== 1 || typeof value.createdAt !== "string" || !Array.isArray(value.entries)) return null;
		return {
			version: 1,
			createdAt: value.createdAt,
			reason: typeof value.reason === "string" ? value.reason : "Backup",
			kind: value.kind === "outside-edit" ? "outside-edit" : "change",
			storage: value.storage === "note" ? "note" : "hidden",
			entries: value.entries.filter((entry): entry is SymbolEntry =>
				typeof entry === "object" && entry !== null && typeof (entry as SymbolEntry).name === "string"),
			notePath: typeof value.notePath === "string" ? value.notePath : undefined,
			noteContent: typeof value.noteContent === "string" ? value.noteContent : undefined,
		};
	} catch {
		return null;
	}
}
