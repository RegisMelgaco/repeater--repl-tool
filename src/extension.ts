import { window, commands, ExtensionContext, workspace, Terminal } from 'vscode';

const TERMINAL_NAME = 'repeater--repl-tool';


function getLaunchReplCommand() {
	const configs = workspace.getConfiguration();
	return configs['repeater--repl-tool']['launchReplCommand'];
}

function startRepl() {
	const terminal = window.createTerminal(TERMINAL_NAME);
	terminal.show(true);
	terminal.sendText(
		getLaunchReplCommand()
	);

	return terminal;
}

function getOrStartRepl() {
	const terminals = window.terminals;
	return terminals.filter(t => t.name === TERMINAL_NAME)[0] ?? startRepl();
}

function restartRepl() {
	const terminals = window.terminals;
	const oldTerminal = terminals.filter(t => t.name === TERMINAL_NAME);

	if (oldTerminal.length > 0) {
		oldTerminal[0].dispose();
	}

	return startRepl();
}

function sendToReplSelectedCode(terminal: Terminal) {
	const editor = window.activeTextEditor;

	if (editor !== undefined) {
		if (!editor.selection.isEmpty) {
			const code = window.activeTextEditor?.document.getText(window.activeTextEditor?.selection);

			terminal.sendText(code || '');
		}
	}
}

function registerRunCode(){
	return commands.registerCommand('repeater--repl-tool.runCode', () => {
		const terminal = getOrStartRepl();

		sendToReplSelectedCode(terminal);
	});
}

function registerClearAndRunCode() {
	return commands.registerCommand('repeater--repl-tool.clearAndRunCode', () => {
		const terminal = restartRepl();

		sendToReplSelectedCode(terminal);
	});
}

export function activate(context: ExtensionContext) {
	const runCode = registerRunCode();
	context.subscriptions.push(runCode);

	const clearAndRunCode = registerClearAndRunCode();
	context.subscriptions.push(clearAndRunCode);
}

export function deactivate() { }
