# Development

This page tells you how to build, test and release Better MathJax. For what the plugin does, see [Features](FEATURES.md).

## Commands

```sh
npm install
npm run dev              # build main.js again after each change
npm test                 # unit tests (vitest), including a render check of every built-in symbol
npm run build:registry   # make src/symbols/builtin-symbols.json again from the MathJax command tables
npm run build            # typecheck and production build
npm run lint
```

## Code layout

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

## Releasing

1. Run `npm version <new version>`, for example `npm version 2.0.2`. This updates `package.json`, `manifest.json` and `versions.json`, makes a commit, and adds a tag without a `v` prefix.
2. Run `git push --follow-tags`. The *Release* workflow checks that the tag and the plugin version are the same. Then it runs the lint, the tests and the build, and makes a draft GitHub release with `main.js`, `manifest.json` and `styles.css`.
3. Check the draft and publish it. Obsidian reads the version from `manifest.json` on `master`, so the release commit must be on `master`.

## Built-in symbols

`src/symbols/builtin-symbols.json` lists each command and environment that Obsidian's MathJax supports, about 1,260 entries. This is MathJax 4.1.3 with the TeX packages that Obsidian loads.

`npm run build:registry` keeps the list current:

- It cleans the hand-written descriptions.
- It adds the commands that MathJax knows and the list does not have.
- It makes snippets for commands that take arguments.
- It gives each entry a preview that renders.

The tests render each example, snippet and preview with the same MathJax version and packages. If a change breaks one of them, `npm test` fails.

Commands that define macros or labels (`\def`, `\newcommand`, `\label`, …) have `"preview": false`. A preview of such a command would define the macro for the full page.
