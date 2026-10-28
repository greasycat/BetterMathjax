# Better MathJax for Obsidian

Better MathJax suggests MathJax commands and environments while you type math in Obsidian. You can change any built-in symbol and add your own.

<img src="https://raw.githubusercontent.com/greasycat/BetterMathjax/master/docs/screenshots/suggestions.png" alt="Suggestion list with rendered previews while typing \fr" width="560">

## Features

For all features, with screenshots, see [Features](https://github.com/greasycat/BetterMathjax/blob/master/docs/FEATURES.md).

- **Suggestions in math.** Type a command name in `$…$` or `$$…$$` to see matching symbols with rendered previews. You do not have to type the backslash: `frac` suggests `\frac`, and `pmat` suggests a full `pmatrix` block.
- **Snippets with fields.** Accept `\frac` to insert `\frac{@1@}{@2@}`. Press `Tab` to go to the next field.
- **Tab stops.** In math, `Tab` also moves past closing brackets. It goes first past the brackets that the plugin or Obsidian added for you. `Shift+Tab` moves back.
- **Macros from the note.** Macros that a note defines with `\newcommand`, `\DeclareMathOperator` and similar commands become suggestions in that note.
- **Auto-braces.** Type `_` or `^` in math to get `_{}` or `^{}`.
- **Formatting.** Indent environments, align `&` columns and remove extra spaces. The math renders the same as before.
- **Math without indentation.** One setting stops all indentation in math, from `Tab`, `Enter`, snippets and the formatter.
- **Symbol reference.** See the description, examples and related symbols of a command.
- **Symbol browser.** Search about 1,260 built-in symbols. Customize or disable any of them.
- **Custom symbols.** Add your own symbols in a form with a live preview. Keep them in the plugin settings, or in a note that you or an AI agent can edit.
- **Backups.** Before a change replaces or removes a symbol, the plugin saves a backup that you can restore.

<img src="https://raw.githubusercontent.com/greasycat/BetterMathjax/master/docs/screenshots/symbol-editor.png" alt="Editor for a custom symbol with a live preview of its snippet" width="420">

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

For the build commands, the code layout and the release steps, see [Development](https://github.com/greasycat/BetterMathjax/blob/master/docs/DEV.md).

## Credits

- Symbol data: [MathJax TeX syntax reference](https://www.onemathematicalcat.org/MathJaxDocumentation/TeXSyntax.htm) (CC 2.5), completed from the MathJax command tables
- [BetterLatexForObsidian](https://github.com/greasycat/BetterLatexForObsidian), the first version (MIT)
