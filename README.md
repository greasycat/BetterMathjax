# Better MathJax for Obsidian

Better MathJax suggests MathJax commands and environments while you type math in Obsidian. You can change any built-in symbol and add your own.

<img src="https://raw.githubusercontent.com/greasycat/BetterMathjax/master/docs/screenshots/suggestions.png" alt="Suggestion list with rendered previews while typing \fr" width="560">

## Features

- **Suggestions in math.** Type a backslash command in `$…$` or `$$…$$` to see matching symbols with rendered previews.
- **Snippets with fields.** Accept `\frac` to insert `\frac{@1@}{@2@}`. Press `Tab` to go to the next field.
- **Environments without a backslash.** Type `pmat` in math to insert a full `pmatrix` block.
- **Auto-braces.** Type `_` or `^` in math to get `_{}` or `^{}`.
- **Formatting.** Indent environments, align `&` columns and remove extra spaces. The math renders the same as before.
- **Symbol reference.** See the description, examples and related symbols of a command.
- **Symbol browser.** Search about 1,260 built-in symbols. Customize or disable any of them.
- **Custom symbols.** Add your own symbols in a form with a live preview. Keep them in the plugin settings, or in a note that you or an AI agent can edit.
- **Backups.** Before a change replaces or removes a symbol, the plugin saves a backup that you can restore.

<img src="https://raw.githubusercontent.com/greasycat/BetterMathjax/master/docs/screenshots/symbol-editor.png" alt="Editor for a custom symbol with a live preview of its snippet" width="420">

For all features, with screenshots, see [Features](https://github.com/greasycat/BetterMathjax/blob/master/docs/FEATURES.md).

## Setup

1. Install Better MathJax from *Settings → Community plugins* and turn it on.
2. Open the plugin settings. The hotkey guide at the top shows the commands that have no hotkey.
3. Assign hotkeys in *Settings → Hotkeys*. The plugin does not set hotkeys, but `Tab`, `Enter` and the arrow keys work without them.

## Upgrading from 1.x

Your settings and hotkeys stay the same, with one exception. These three commands have new IDs, so you must assign their hotkeys again:

- *Select next placeholder*
- *Select previous placeholder*
- *Show symbol reference* (before 2.0: *Show mathjax helper on current selection*)

The hotkey guide in the plugin settings shows the commands that have no hotkey.

The first time 2.0 starts, it imports the symbols from your old symbol note. The plugin finds the note from your 1.x settings, or uses `symbols.md`. A message tells you how many symbols it found. The plugin does not change the note, so you can send it to the trash after the import. To import a note in the old format later, use *Import from note* in the settings or run *Import custom symbols from note*.

Version 2.0 also makes these changes:

- It removes the fuzzy-search setting. One ranker puts an exact match first, then names that start with the query, then names that contain it. Letter case counts, so `\delta` and `\Delta` are different suggestions.
- It removes the debug-log setting.
- The subscript and superscript option now works while you type. Thus the *Insert subscript/superscript* commands are gone.

## Development

```sh
npm install
npm run dev              # build main.js again after each change
npm test                 # unit tests (vitest), including a render check of every built-in symbol
npm run build:registry   # make src/symbols/builtin-symbols.json again from the MathJax command tables
npm run build            # typecheck and production build
npm run lint
```

| Path | Contents |
|---|---|
| `src/main.ts` | Connects the parts of the plugin |
| `src/math/context.ts` | Finds math regions, and tells if a position is in math |
| `src/format/` | The TeX formatter, and the code that applies it to the math of a note |
| `src/search/ranker.ts` | Scores and sorts the matches |
| `src/snippet/placeholders.ts` | Finds placeholders and indents snippets |
| `src/symbols/` | The built-in data, the registry, custom-symbol storage, the `jsonl` note, backups and the import of 1.x notes |
| `src/editor/` | The suggestion list, snippet fields, auto-braces, the cached math scan and the formatting commands |
| `src/ui/` | The symbol reference, browser, editor and restore windows |
| `src/settings/` | The settings, the 1.x migration and the settings tab |

The code in `src/math/`, `src/format/`, `src/search/` and `src/snippet/` does not use Obsidian, so the tests run it directly. Only `src/editor/suggest-internals.ts` uses undocumented Obsidian internals (the selected row of the suggestion list). If those internals change, that module stops safely.

### Releasing

1. Run `npm version <new version>`, for example `npm version 2.0.2`. This updates `package.json`, `manifest.json` and `versions.json`, makes a commit, and adds a tag without a `v` prefix.
2. Run `git push --follow-tags`. The *Release* workflow checks that the tag and the plugin version are the same. Then it runs the lint, the tests and the build, and makes a draft GitHub release with `main.js`, `manifest.json` and `styles.css`.
3. Check the draft and publish it. Obsidian reads the version from `manifest.json` on `master`, so the release commit must be on `master`.

### Built-in symbols

`src/symbols/builtin-symbols.json` lists each command and environment that Obsidian's MathJax supports, about 1,260 entries. This is MathJax 4.1.3 with the TeX packages that Obsidian loads.

`npm run build:registry` keeps the list current:

- It cleans the hand-written descriptions.
- It adds the commands that MathJax knows and the list does not have.
- It makes snippets for commands that take arguments.
- It gives each entry a preview that renders.

The tests render each example, snippet and preview with the same MathJax version and packages. If a change breaks one of them, `npm test` fails.

Commands that define macros or labels (`\def`, `\newcommand`, `\label`, …) have `"preview": false`. A preview of such a command would define the macro for the full page.

## Credits

- Symbol data: [MathJax TeX syntax reference](https://www.onemathematicalcat.org/MathJaxDocumentation/TeXSyntax.htm) (CC 2.5), completed from the MathJax command tables
- [BetterLatexForObsidian](https://github.com/greasycat/BetterLatexForObsidian), the first version (MIT)
