import {EditorSelection, EditorState, StateField, Text, TransactionSpec} from "@codemirror/state";
import {EditorView} from "@codemirror/view";

export function subscriptHandler() {
	return [
		EditorState.transactionFilter.of(tr => {
			if (tr.isUserEvent("input"))
			{
				tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
					if (inserted.sliceString(0, inserted.length) === "_") {
						console.log("subscript");
						// create a new transaction
						// apply the transaction
						const tr2 = tr.state.update({
							changes: {
								from: fromA,
								to: toA,
								insert: "adf"
							}
						});
						return tr2;
					}
				});
			}
			return tr;
		})
	]
}

