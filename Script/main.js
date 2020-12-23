// Feel free to modify, If you break something.
// Just Reinstall this extention. :)
/// <reference path="./global.d.ts" />
Object.assign(globalThis, require('vscode'));
const
	fs = require("fs").promises,
	util = require("util"),
	{ join, dirname } = require("path"),
	{ workspaceFolders } = workspace,
	{ extensionPath } = extensions.getExtension("nur.script"),
	defaultPath = workspace.getConfiguration("script").get("path"),
	outputChannel = window.createOutputChannel("Script"),
	openTextFile = (...filePath) => workspace.openTextDocument(Uri.file(join(...filePath))).then(window.showTextDocument),
	/** runingScript : {path:string,name:string}[] */
	/** scriptFiles : Promice<{path:string,workspaceName:string}[]> */
	runingScript = [], scriptFiles = [];

function printErr(err) {
	outputChannel.appendLine("\n" + util.inspect(err));
	window.showErrorMessage(err?.message);
}
function deferred() {
	let methods;
	const promise = new Promise((resolve, reject) => {
		methods = { resolve, reject };
	});
	return Object.assign(promise, methods);
}
function addScript(name, ...directorys) {
	let path = join(...directorys, "main.js");
	let promise = fs.stat(path)
		.then(stats => ({ path, name, stats }))
		.catch(() => Promise.reject({ path, name }));
	scriptFiles.push(promise);
}
let activateSignal = deferred();
let deactivateSignal = deferred();
// --------------------------  API  ----------------------------------
globalThis.Script = {
	onActivate(fn) {
		return activateSignal.then(fn)
	},
	onDeactivate(fn) {
		return deactivateSignal.then(fn)
	},
	output(method, option = false) {
		method == "show" ? outputChannel.show(option) :
			method == "clear" ? outputChannel.clear() :
				method == "hide" ? outputChannel.hide() : null
	}
}
globalThis.Context = deferred();
globalThis.print = (data) => outputChannel.append(util.inspect(data));
globalThis.printLn = (data) => outputChannel.appendLine(util.inspect(data))
//-------------------------------------------------------------------------------

defaultPath && addScript("Default", defaultPath);

if (workspaceFolders)
	for (let folder of workspaceFolders)
		addScript(folder.name, folder.uri.fsPath, ".vscode")

let quickPicker = window.createQuickPick()
quickPicker.matchOnDescription = true

let cmd = commands.registerCommand("script.statusBarItem", () => {
	quickPicker.show();
	quickPicker.items = [
		{ label: "Show Output" },
		{ label: "Clear Output" },
		{ label: "Open Config File" },
		...runingScript.map(({ path: description, name: label }) => ({ label, description })),
	]
	let onAcceptCleaner = quickPicker.onDidAccept(() => {
		let selected = quickPicker.selectedItems[0]
		if (selected.label == "Open Config File")
			openTextFile(extensionPath, "package.json")
		else if (selected.label == "Show Output")
			outputChannel.show(false)
		else if (selected.label == "Clear Output")
			outputChannel.clear()
		else
			// this is the path of script file
			// this is not multiSelect,So selected item is the 1st of `quickPicker.selectedItems[]`.
			openTextFile(selected.description)

		quickPicker.hide();
		onAcceptCleaner.dispose() // clean after finished 
	})
})

let statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 10000)

statusBarItem.text = " Script "
statusBarItem.color = "#0ff"
statusBarItem.command = "script.statusBarItem"
statusBarItem.show()

module.exports = {
	activate(ctx) {
		Context.resolve(ctx)
		activateSignal.resolve(ctx)
		ctx.subscriptions.push(cmd)
	},
	deactivate() {
		deactivateSignal.resolve();
		statusBarItem.dispose();
		outputChannel.dispose();
	}
}

Promise.allSettled(scriptFiles).then(resolvedScripts => {
	/* when script file found = script { fs.stats, path, workspaceName }
			then await for activation & deactivation signal
	
	when script file not found = reason { path, workspaceName } 
			then ask if user want to creact a script file
				 if 'Create' & (!in `ignoreScripts`):
					writeFile then  openTextFile
				  elif 'Later':
					add script path to `ignoreScripts` */
	for (const result of resolvedScripts)
		if (result.status == "rejected")
			Script.onActivate(async ctx => {
				let { path, name } = result.reason
				let ignoreScripts = ctx.workspaceState.get("ignoreScripts") || [];
				if (ignoreScripts.includes(path)) return

				let is = await window.showInformationMessage(`Want to create a script for ${name}?\n\n\t${path}`, "Create", "Later")
				if (is == "Later")
					ctx.workspaceState.update("ignoreScripts", [...ignoreScripts, path])
				if (is == "Create") {
					await fs.mkdir(dirname(path), { recursive: true })
					await fs.writeFile(path, example, { encoding: "utf-8" })
					openTextFile(path);
				}
			}).catch(printErr)
		else if (result.value.stats.isFile()) try {
			let { path, name } = result.value;
			runingScript.push({ path, name });

			let { activate, deactivate } = require(path);
			typeof activate == "function" &&
				Script.onActivate(activate).catch(printErr)
			typeof activate == "function" &&
				Script.onDeactivate(deactivate).catch(printErr)
		} catch (err) { printErr(err) }
})

let example = `/// <reference path="${join(extensionPath, "global.d.ts").replace(/\\/g, "/")}" />
// API - https://code.visualstudio.com/api/references/vscode-api 
// reload window after edit...

window.showInformationMessage('Hello World!')
`
