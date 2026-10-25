import {App, ButtonComponent, Modal, Notice} from "obsidian";
import type BetterMathjaxPlugin from "../main";
import {diffEntries, type Backup} from "../symbols/backups";
import type {SymbolEntry} from "../symbols/types";

/** Lists the backups, newest first: when each was taken and how many symbols it holds. */
export class RestoreModal extends Modal {
	constructor(app: App, private readonly plugin: BetterMathjaxPlugin) {
		super(app);
	}

	override async onOpen(): Promise<void> {
		this.titleEl.setText("Restore custom symbols");
		this.contentEl.addClass("better-mathjax-restore");
		const list = this.contentEl.createDiv({cls: "better-mathjax-restore-list"});
		const backups = await this.plugin.customSymbols.listBackups();
		if (backups.length === 0) list.createDiv({cls: "better-mathjax-restore-empty", text: "No backups yet."});
		const current = this.plugin.customSymbols.entries;
		for (const {path, backup} of backups) this.renderRow(list, path, backup, current);
	}

	private renderRow(list: HTMLElement, path: string, backup: Backup, current: readonly SymbolEntry[]): void {
		const row = list.createDiv({cls: "better-mathjax-restore-row"});
		const when = new Date(backup.createdAt).toLocaleString();
		const count = backup.entries.length;
		row.createDiv({cls: "better-mathjax-restore-info", text: `${when} · ${count} symbol${count === 1 ? "" : "s"}`});

		// Nothing to restore when the backup holds exactly the current symbols.
		const diff = diffEntries(current, backup.entries);
		const same = diff.added.length + diff.removed.length + diff.changed.length === 0 && backup.noteContent === undefined;
		new ButtonComponent(row)
			.setButtonText("Restore")
			.setDisabled(same)
			.onClick(async () => {
				try {
					await this.plugin.customSymbols.restore(backup);
					new Notice(`Restored the backup from ${when}.`);
					this.close();
				} catch (error) {
					new Notice(`Could not restore: ${error instanceof Error ? error.message : String(error)}`, 8000);
				}
			});
		this.addDeleteButton(row, path);
	}

	/** Two clicks: the first asks for confirmation, the second deletes the backup and removes its row. */
	private addDeleteButton(row: HTMLElement, path: string): void {
		let armed = false;
		const button = new ButtonComponent(row).setButtonText("Delete");
		button.onClick(async () => {
			if (!armed) {
				armed = true;
				button.setButtonText("Confirm").setWarning();
				return;
			}
			try {
				await this.plugin.customSymbols.deleteBackup(path);
				row.remove();
			} catch (error) {
				new Notice(`Could not delete the backup: ${error instanceof Error ? error.message : String(error)}`, 8000);
			}
		});
	}

	override onClose(): void {
		this.contentEl.empty();
	}
}
