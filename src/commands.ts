import {Command} from 'obsidian';
import MathjaxSuggest from './mathjax-suggest';

export function SelectNextSuggestCommand(latexSuggest: MathjaxSuggest): Command  {
    return {
                id: 'betterlatex-select-next-suggestion',
                name: 'Select next suggestion',
                hotkeys: [
                    {
                        key: "ArrowDown",
                        modifiers: []
                    }
                ],
                repeatable: true, editorCallback: (_:never) => {
                    latexSuggest.selectNextSuggestion();
            },
    }
}
export function SelectPreviousSuggestCommand(latexSuggest: MathjaxSuggest): Command  {
    return {
                id: 'betterlatex-select-previous-suggestion',
                name: 'Select previous suggestion',
                hotkeys: [
                    {
                        key: "ArrowUp",
                        modifiers: []
                    }
                ],
                repeatable: true, editorCallback: (_:never) => {
                    latexSuggest.selectPreviousSuggestion();
            },
    }
}

export function SelectNextPlaceholderCommand(latexSuggest: MathjaxSuggest): Command  {
	return {
				id: 'betterlatex-select-next-placeholder',
				name: 'Select next placeholder',
				hotkeys: [
					{
						key: "'",
						modifiers: ["Ctrl"]
					}
				],
				repeatable: true, editorCallback: (_:never) => {
					latexSuggest.selectNextPlaceholder();
			},
	}
}

export function SelectPreviousPlaceholderCommand(latexSuggest: MathjaxSuggest): Command  {
	return {
				id: 'betterlatex-select-previous-placeholder',
				name: 'Select previous placeholder',
				hotkeys: [
					{
						key: ";",
						modifiers: ["Ctrl"]
					}
				],
				repeatable: true, editorCallback: (_:never) => {
					latexSuggest.selectPreviousPlaceholder();
			},
	}
}

export function ShowMathjaxHelperOnCurrentSelection(latexSuggestions: MathjaxSuggest): Command  {
	return {
				id: 'betterlatex-show-mathjax-helper-on-current-selection',
				name: 'Show mathjax helper on current selection',
				hotkeys: [
					{
						key: "?",
						modifiers: ["Ctrl", "Shift"]
					}
				],
				repeatable: true, editorCallback: (_:never) => {
					latexSuggestions.showMathjaxHelperOnCurrentSelection();
			},
	}
}
