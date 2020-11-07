Object.assign(globalThis, require('vscode'));
let fs = require("fs");
let { writeFile } = require("./utils");

let example = `// reload window after edit...
// API - https://code.visualstudio.com/api/references/vscode-api 

window.showInformationMessage('Hello World!');
`

let { workspaceFolders } = workspace;
let { main, path } = workspace.getConfiguration("script")

if (!path && !workspaceFolders)
	return

path = path ? path : workspaceFolders[0].uri.fsPath + "\\.vscode";
main = path + `\\${main}.js`;

try {
	if (fs.statSync(path).isDirectory()) {
		process.chdir(path);
		module.exports = require(main);
	};
} catch (err) {
	if (err?.code == "MODULE_NOT_FOUND")
		window.showInformationMessage("Want to create a Script?", "Cancel", "Create")
			.then(is => is == "Create" ? writeFile(main, example) : Promise.reject())
			.then(() => workspace.openTextDocument(Uri.file(main)))
			.then(doc => window.showTextDocument(doc))
			.catch(() => { });
	else
		window.showInformationMessage(err?.message);
}