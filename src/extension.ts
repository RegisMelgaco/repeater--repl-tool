import * as vscode from 'vscode';

const terminalName = 'repeater--repl-tool';

function startInterpreter() {
	const terminal = vscode.window.createTerminal(terminalName);
	terminal.show(true);
	terminal.sendText('iex');

	return terminal;
}

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('repeater--repl-tool.runCode', () => {
		const terminals = vscode.window.terminals;
		const terminal = terminals.filter(t => t.name === terminalName)[0] ?? startInterpreter();

		const editor = vscode.window.activeTextEditor;

		if (editor !== undefined) {
			if (!editor.selection.isEmpty) {
				const code = vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor?.selection);

				terminal.sendText(code || '');
			}
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
