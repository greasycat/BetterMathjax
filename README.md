# Better MathJax for Obsidian

Autocompletion for MathJax in Obsidian, with snippets you can edit, placeholders you can jump between, and a reference card for each symbol.

## Features

- **Suggestions inside math.** Type a backslash command inside `$…$` or `$$…$$` to get ranked suggestions, each with a rendered preview. Dollars inside code blocks, inline code and frontmatter are ignored, and so is an escaped `\$`. You can also turn suggestions on everywhere.

  <img src="https://raw.githubusercontent.com/greasycat/BetterMathjax/master/docs/screenshots/suggestions.png" alt="Suggestion list with rendered previews while typing \fr" width="560">

- **Snippets with placeholders.** Accepting `\frac` inserts `\frac{@1@}{@2@}` and selects the first placeholder. Press `Tab` / `Shift+Tab` (or the placeholder commands) to move between the fields; set *Placeholder jump key* to *Hotkeys* to use other keys instead. Fields stay highlighted and jumpable after you type into them, so you can go back and fix one. A snippet inserted inside a field is handled first, then you continue with the outer one. The snippet ends when you move the cursor out of it, or press *next* on the last field once all fields are filled; the cursor then lands after the snippet. Outside a snippet, *next* jumps to the next `@n@` marker in the note, or past the next `}` on the line.

  <img src="https://raw.githubusercontent.com/greasycat/BetterMathjax/master/docs/screenshots/snippet-fields.png" alt="A fraction snippet with the filled numerator still highlighted and the denominator field selected" width="560">

- **Environments.** Inside math, type the first letters of an environment name, such as `pmat`, with no backslash, and pick `pmatrix` to insert a full `\begin{pmatrix} … \end{pmatrix}` block. Typing `\begin{pm` works too. Only names that start with what you typed are suggested, so variables like `ab` do not open the list, and words in ordinary text never do. To allow only backslash commands, turn on *Require a backslash*. Inside blockquotes and callouts, each inserted line keeps the `>` prefix.

  <img src="https://raw.githubusercontent.com/greasycat/BetterMathjax/master/docs/screenshots/environments.png" alt="Typing pmat in math suggests the pmatrix environments" width="560">

- **Formatting.** *Format math at cursor* tidies the math block you are in, and *Format all math in note* does every block at once. Environment bodies are indented with one row per line, `&` columns are aligned, and runs of spaces become one. Everything else stays as you wrote it, and the result renders exactly as before. Indentation follows Obsidian's *Indent using tabs* and *Tab indent size* settings, and math in blockquotes and callouts keeps its `>` prefix. Inline math only has its spaces tidied. One undo reverts the whole change. With *Format math when you leave it* turned on (off by default), a block is formatted when the cursor moves out of it by arrow keys, a click or a jump. Typing never triggers it.

  <img src="https://raw.githubusercontent.com/greasycat/BetterMathjax/master/docs/screenshots/format-before.png" alt="Math blocks before formatting" width="420"> <img src="https://raw.githubusercontent.com/greasycat/BetterMathjax/master/docs/screenshots/format-after.png" alt="The same blocks after formatting, indented with aligned columns" width="420">

- **Auto-braces.** In math, typing `_` or `^` inserts `_{}` or `^{}` with the cursor inside. If text is selected, it is wrapped instead.
- **Symbol reference.** Run *Show symbol reference* to see the description, rendered examples and related symbols for the highlighted suggestion, or for the command under the cursor. *Customize* opens the symbol in the editor.

  <img src="https://raw.githubusercontent.com/greasycat/BetterMathjax/master/docs/screenshots/symbol-reference.png" alt="Symbol reference for \frac" width="420">

- **Symbol browser and custom symbols.** Browse all 1,260 built-in symbols, customize any of them, add your own, or turn off ones you never use (see [Custom symbols](#custom-symbols)).

  <img src="https://raw.githubusercontent.com/greasycat/BetterMathjax/master/docs/screenshots/symbol-browser.png" alt="Symbol browser searching for matrix" width="640">

## Hotkeys

The plugin sets no hotkeys by default. Assign them in *Settings → Hotkeys*; the guide at the top of the plugin settings shows which are set. For example:

| Command | Example hotkey |
|---|---|
| Select next suggestion | `Ctrl+]` |
| Select previous suggestion | `Ctrl+[` |
| Accept suggestion | any key you like |
| Select next placeholder | `Ctrl+'` |
| Select previous placeholder | `Ctrl+;` |
| Show symbol reference | `Ctrl+Shift+/` |
| Format math at cursor / Format all math in note / Browse all symbols / Add custom symbol / Browse custom symbols / Import custom symbols from note / Open symbol note / Restore custom symbols from backup | — |

`↑`/`↓` and `Enter` always work in the suggestion list, and so does `Tab` unless you set *Accept suggestion key* to *Enter or hotkey* and bind the *Accept suggestion* command instead. Inside a snippet, `Tab` and `Shift+Tab` also move between placeholders; while the suggestion list is open, `Tab` accepts instead. Tab is handled by the editor rather than as an Obsidian hotkey, so outside a snippet it keeps its normal job (a Tab hotkey would block indenting everywhere). To use other keys, set *Placeholder jump key* to *Hotkeys* and bind the *Select next/previous placeholder* commands. The suggestion commands, including *Accept suggestion*, only act while the list is open, so their keys keep their normal job everywhere else.

<img src="https://raw.githubusercontent.com/greasycat/BetterMathjax/master/docs/screenshots/settings.png" alt="Plugin settings with the hotkey guide" width="520">

## Custom symbols

Add your own commands, or change the snippet, description or examples of any built-in symbol, without touching JSON:

- **Add custom symbol** (command, or the *Add symbol* button in the settings) opens a form with a live preview of the snippet. Run it with the cursor on a command such as `\frac` to start from that symbol.
- **Browse custom symbols** (command, or *Browse and edit*) searches every symbol. Your own are listed first, and typing a name that does not exist offers to create it.
- **Customize** in the symbol reference opens the same form for the symbol you are looking at.

For a built-in symbol, fields you leave empty keep the built-in value, and *Reset to built-in* removes your changes.

<img src="https://raw.githubusercontent.com/greasycat/BetterMathjax/master/docs/screenshots/symbol-editor.png" alt="Editor for a custom symbol with a live preview of its snippet" width="420">

### Browsing and disabling symbols

*Browse symbols* in the settings (or the *Browse all symbols* command) lists every symbol, built-in and your own, about 1,260 in all. You can search by name or description, and filter by source (built-in, customized, your own, disabled) or by MathJax package. Each row shows a preview, a *Customize* or *Edit* button, and an eye icon that turns the symbol off or on.

A disabled symbol does not appear in the suggestion list, but it stays in the browser and the symbol reference. When the list is filtered, *Disable N* and *Enable N* change every symbol shown at once, for example a whole package you never use. The editor has the same switch, *Show in suggestions*. A disabled symbol is stored as `{"name": "\\textcent", "disabled": true}`, in the plugin settings or in your symbol note.

### Where they are stored

Choose in the settings under *Where symbols are stored*:

- **Hidden (plugin settings)**, the default. Symbols are saved in `.obsidian/plugins/better-mathjax/data.json`, so nothing appears among your notes. Edit them with the commands above.
- **Note in your vault.** Symbols live in a note (`Better MathJax Symbols.md` by default) as a `jsonl` code block, one symbol per line:

  ````markdown
  ```jsonl
  {"name":"\\R","snippet":"\\mathbb{R}^{@1@}","description":"The real numbers."}
  {"name":"\\E","snippet":"\\mathbb{E}\\left[@1@\\right]"}
  ```
  ````

  You, or an AI agent that can edit your notes, can change the block directly; edits apply as soon as the note is saved. Lines that are not valid are reported with their line number and skipped, and the other lines still work. When the plugin saves a symbol, it rewrites only that line, so the rest of the note stays as you wrote it. Renaming or moving the note in Obsidian is followed automatically.

Switching between the two moves your symbols across. Switching from the note back to hidden first checks every line: if all are valid, the symbols move into the plugin settings and the note goes to the trash; if any line has a problem, nothing changes and you get a warning listing the lines to fix.

### Backups

Before a change replaces or removes a symbol, the plugin saves a backup in its own folder (`.obsidian/plugins/better-mathjax/backups/`), out of sight. The plugin compares your symbols before and after each write, so adding new symbols never creates a backup. This applies to the editor, imports, restores, switching where symbols are stored, and edits to the symbol note from outside the plugin, for example by an agent. Outside edits in quick succession share one backup. The 10 newest backups are kept.

*Restore…* in the settings (or the *Restore custom symbols from backup* command) lists the backups, newest first, with what each one would bring back, remove or change. Click *Restore* to restore one, or *Delete* and then *Confirm* to delete it. If a restore replaces or removes a symbol, your current symbols are backed up first, so the restore can be undone.

## Upgrading from 1.x

Your existing settings carry over, and so do your hotkeys, except for three commands whose IDs changed: *Select next placeholder*, *Select previous placeholder* and *Show symbol reference* (formerly *Show mathjax helper on current selection*). Assign their hotkeys again; the hotkey guide at the top of the plugin settings shows which ones are not set. The first time 2.0 loads, it imports the symbols from your old symbol note (the path from your 1.x settings, or `symbols.md`) and tells you how many it found. The note itself is left as it was, and you can delete it afterwards. To bring in another note in the old format later, use *Import from note* in the settings or the *Import custom symbols from note* command.

Two other things changed:

- The fuzzy-search algorithm setting is gone. One ranker now orders matches as exact match, then prefix, then substring, then subsequence. It is case-sensitive, so `\delta` and `\Delta` are different suggestions.
- The debug-log setting is gone.

The sub/superscript option now works as you type, and the old *Insert subscript/superscript* commands are removed.

## Development

```sh
npm install
npm run dev        # watch build to main.js
npm test           # unit tests (vitest), including a render check of every built-in symbol
npm run build:registry   # rebuild src/symbols/builtin-symbols.json from MathJax's own command tables
npm run build      # typecheck + production build
npm run lint
```

| Path | Role |
|---|---|
| `src/main.ts` | Plugin wiring only |
| `src/math/context.ts` | Pure: is the cursor inside math, and where are the math regions? |
| `src/format/` | Pure: the minimal TeX formatter and applying it to a note's math regions |
| `src/search/ranker.ts` | Pure: match scoring and ranking |
| `src/snippet/placeholders.ts` | Pure: placeholder search and snippet indentation |
| `src/symbols/` | Built-in data, the registry that merges user overrides, pure custom-symbol list operations, the jsonl note reader/writer (`jsonl-note.ts`), backup helpers (`backups.ts`), the pre-2.0 note reader (import only), and `custom-symbol-store.ts`, which saves to the plugin data or the note and runs the one-time migration |
| `src/editor/` | `EditorSuggest`, the CodeMirror auto-brace extension, insertion helpers |
| `src/ui/` | Reference modal, MathJax preview helper |
| `src/settings/` | Settings model with 1.x migration, settings tab |

`src/editor/suggest-internals.ts` is the only module that touches undocumented Obsidian internals (the selected row of the suggestion list), and it fails softly if they change.

### Releasing

1. Run `npm version <new version>` (for example `npm version 2.0.1`). It updates `package.json`, `manifest.json` and `versions.json`, commits, and tags the commit without a `v` prefix, as Obsidian expects.
2. Run `git push --follow-tags`. The *Release* workflow checks that the tag matches the plugin version, runs lint, tests and the build, and creates a draft GitHub release with `main.js`, `manifest.json` and `styles.css`.
3. Check the draft and publish it. Obsidian picks up the new version from `manifest.json` on `master`, so the release commit must be on `master`.

### Built-in symbols

`src/symbols/builtin-symbols.json` lists every command and environment the MathJax in Obsidian supports (MathJax 4.1.3 with Obsidian's TeX packages), about 1,260 entries. `npm run build:registry` keeps it in step: it cleans the hand-written descriptions, adds what MathJax knows but the list lacks, works out snippets for commands that take arguments, and gives every entry a preview that renders. The tests render every example, snippet and preview with the same MathJax version and packages, so a change that breaks one fails `npm test`. Commands that define macros or labels (`\def`, `\newcommand`, `\label`, …) have `"preview": false`: rendering them in a preview would define the macro for the whole page.

## Credits

- Symbol data: [MathJax TeX syntax reference](https://www.onemathematicalcat.org/MathJaxDocumentation/TeXSyntax.htm) (CC 2.5), completed from MathJax's own command tables
- [BetterLatexForObsidian](https://github.com/greasycat/BetterLatexForObsidian), the first attempt (MIT)
