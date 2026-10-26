import {readFileSync} from "node:fs";
import {describe, expect, it} from "vitest";

// Obsidian adds the plugin ID to every command ID, so an ID must not repeat it (a submission requirement).
describe("command IDs", () => {
	it("do not contain the plugin ID", () => {
		const manifest = JSON.parse(readFileSync(new URL("../manifest.json", import.meta.url), "utf8")) as {id: string};
		const source = readFileSync(new URL("../src/commands.ts", import.meta.url), "utf8");
		const block = source.slice(source.indexOf("COMMAND_IDS = {"), source.indexOf("} as const"));
		const ids = [...block.matchAll(/:\s*"([^"]+)"/g)].map((match) => match[1]);
		expect(ids.length).toBeGreaterThan(10);
		expect(ids.filter((id) => id!.includes(manifest.id))).toEqual([]);
	});
});
