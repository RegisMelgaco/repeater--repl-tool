import { window, commands, ExtensionContext, workspace } from 'vscode';

const TERMINAL_NAME = 'repeater--repl-tool';


function getLaunchReplCommand() {
	const configs = workspace.getConfiguration();
	return configs['repeater--repl-tool']['launchReplCommand'];
}

function startInterpreter() {
	const terminal = window.createTerminal(TERMINAL_NAME);
	terminal.show(true);
	terminal.sendText(
		getLaunchReplCommand()
	);

	return terminal;
}

function registerRunCode(){
	return commands.registerCommand('repeater--repl-tool.runCode', () => {
		const terminals = window.terminals;
		const terminal = terminals.filter(t => t.name === TERMINAL_NAME)[0] ?? startInterpreter();

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

export function deactivate() { }
