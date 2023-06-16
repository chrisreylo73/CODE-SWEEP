// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('code-sweep.deleteComments', () => {
		// Defines an editor using vscode API 
		const editor = vscode.window.activeTextEditor;
		if(!editor){
			vscode.window.showInformationMessage('Editor Undefined');
			return;
		}
		//Get the langauge of the file
		const language = editor.document.languageId;
		//Get document text
		// const docText = editor.document.getText();
		const commentTypeOne = ["javascript", "java", "c++", "c", "c#","swift","php","rust","go","lua","dart","kotlin", "typescript", "scala","css"];
		const commentTypeTwo = ["python"];
		const commentTypeThree = ["html","xml","xhtml","xslt"];
		let commentRegex;
		if (commentTypeOne.includes(language)){
			commentRegex = /(\/\*[\s\S]*?\*\/)|(\/\/.*)/g;
		}else if (commentTypeTwo.includes(language)){
			commentRegex = /(^|[^'"])(#.*)/g;
		}else if(commentTypeThree.includes(language)){
			commentRegex = /<!--[\s\S]*?-->/g;
		}
		else{
			vscode.window.showInformationMessage(`Sorry Code Sweep does not support "${language}!"`);
			return;
		}
		cleanCode(commentRegex);
	}));
	
	context.subscriptions.push(vscode.commands.registerCommand('code-sweep.deleteEmptyLines', () => {
		cleanCode(/^\s*[\r\n]/gm);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('code-sweep.deleteConsoleLogs', () => {
		cleanCode(/console\.(?:log|warn|error|info)\(.*?\);?\n?/g);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('code-sweep.deletePrints', () => {
		// Defines an editor using vscode API 
		const editor = vscode.window.activeTextEditor;
		if(!editor){
			vscode.window.showInformationMessage('Editor Undefined');
			return;
		}
		//Get the langauge of the file
		const language = editor.document.languageId;
		const commentTypeOne = ["java"];
		const commentTypeTwo = ["python"];
		let printRegex;
		if (commentTypeOne.includes(language)){
			printRegex = /System\.out\.(?:println|print|printf)\([^;]*\);/g;
			cleanCode(printRegex);
		}
		else if (commentTypeTwo.includes(language)){
			printRegex = /print\([^)]*\)/g;
			cleanCode(printRegex);
		}
		else{
			vscode.window.showInformationMessage(`Sorry Code Sweep does not support "${language}!"`);
			return;
		}
	}));

	function cleanCode(regex: RegExp){
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('Editor Undefined');
			return;
		}
		let docText;
		if(editor.selection.isEmpty){
			docText = editor.document.getText();
			const newText = docText.replace(regex, '');
			editor.edit(editBuilder => {
				const fullRange = new vscode.Range(
				  editor.document.positionAt(0),
				  editor.document.positionAt(docText.length)
				);
				editBuilder.replace(fullRange, newText);
			});
		}else{
			docText = editor.document.getText(editor.selection);
			const newText = docText.replace(regex, '');
			editor.edit(editBuilder => {
				const fullRange = new vscode.Range(
				  editor.document.positionAt(editor.document.offsetAt(editor.selection.start)),
				  editor.document.positionAt(editor.document.offsetAt(editor.selection.end))
				);
				editBuilder.replace(fullRange, newText);
			});
		}
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
