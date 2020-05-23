import { window, commands, ExtensionContext } from 'vscode';

const terminalName = 'repeater--repl-tool';

function startInterpreter() {
	const terminal = window.createTerminal(terminalName);
	terminal.show(true);
	terminal.sendText('iex');

	return terminal;
}

function registerRunCode(){
	return commands.registerCommand('repeater--repl-tool.runCode', () => {
		const terminals = window.terminals;
		const terminal = terminals.filter(t => t.name === terminalName)[0] ?? startInterpreter();

		const editor = window.activeTextEditor;

		if (editor !== undefined) {
			if (!editor.selection.isEmpty) {
				const code = window.activeTextEditor?.document.getText(window.activeTextEditor?.selection);

				terminal.sendText(code || '');
			}
		}
	});
}

export function activate(context: ExtensionContext) {
	const runCode = registerRunCode();

	context.subscriptions.push(runCode);
}

export function deactivate() {}
