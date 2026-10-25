import type {App} from "obsidian";

/**
 * Obsidian has no public API for reading hotkeys or opening the Hotkeys tab with a filter.
 * These helpers use the undocumented `hotkeyManager` and `setting` objects and fail softly.
 */

interface HotkeyManager {
	printHotkeyForCommand(commandId: string): string;
}

interface SettingWindow {
	open(): void;
	openTabById(id: string): unknown;
	activeTab?: {setQuery?: (query: string) => void; searchComponent?: {setValue(value: string): void; inputEl: HTMLInputElement}} | null;
}

/** The hotkey label for a full command ID ("plugin-id:command-id"), "" if none, or null if unknown. */
export function hotkeyLabel(app: App, commandId: string): string | null {
	const manager = (app as unknown as {hotkeyManager?: Partial<HotkeyManager>}).hotkeyManager;
	if (typeof manager?.printHotkeyForCommand !== "function") return null;
	try {
		return manager.printHotkeyForCommand(commandId);
	} catch {
		return null;
	}
}

/** Open Settings → Hotkeys filtered by `query`. Returns false if the internals are unavailable. */
export function openHotkeySettings(app: App, query: string): boolean {
	const setting = (app as unknown as {setting?: Partial<SettingWindow>}).setting;
	if (typeof setting?.open !== "function" || typeof setting.openTabById !== "function") return false;
	setting.open();
	setting.openTabById("hotkeys");
	const tab = setting.activeTab;
	if (typeof tab?.setQuery === "function") {
		tab.setQuery(query);
	} else if (tab?.searchComponent) {
		tab.searchComponent.setValue(query);
		tab.searchComponent.inputEl.dispatchEvent(new Event("input"));
	}
	return true;
}
