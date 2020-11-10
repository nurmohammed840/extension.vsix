// Feel free to modify, If you break something.
// Just Reinstall this extention. :)
/// <reference path="./global.d.ts" />
Object.assign(globalThis, require('vscode'))
let { writeFile, checkFileOrDirectory, deferred } = require("./utils")

let { workspaceFolders } = workspace
let { path } = workspace.getConfiguration("script")
let { extensionPath } = extensions.getExtension("nur.script")
/** runingScript : {path:string,name:string}[] */
/** scriptFiles : script[] */
let runingScript = [], scriptFiles = [];

let printErr = (err) => window.showErrorMessage(err?.message)
let openTextFile = (path) => workspace.openTextDocument(Uri.file(path)).then(window.showTextDocument)
let addScript = (directory, workspaceName) => scriptFiles.push(checkFileOrDirectory(directory + "\\.vscode\\main.js", workspaceName))

let activateSignal = deferred()
let deactivateSignal = deferred()

class Script {
	/**
	 * Listen onActivate.
	 * You can also use it to get `ExtensionContext`
	 * @param {(ctx:ExtensionContext)=>void} fn
	 */
	static onActivate(fn) {
		return activateSignal.then(fn)
	}
	static onDeactivate(fn) {
		return deactivateSignal.then(fn)
	}
}
globalThis.Script = Script

path && addScript(path, "Default")

if (workspaceFolders)
	for (let folder of workspaceFolders)
		addScript(folder.uri.fsPath, folder.name)

let quickPicker = window.createQuickPick()
quickPicker.matchOnDescription = true

let cmd = commands.registerCommand("script.statusBarItem", () => {
	quickPicker.show()
	quickPicker.items = [
		{ label: "Configaration" },
		...runingScript.map(({ path: description, name: label }) => ({ label, description })),
	]
	let onAcceptCleaner = quickPicker.onDidAccept(() => {
		let selected = quickPicker.selectedItems[0]
		if (selected.label == "Configaration")
			openTextFile(extensionPath + "\\package.json")
		else
			// this is the path of script file
			// this is not multiSelect,So selected item is the 1st of `quickPicker.selectedItems[]`.
			openTextFile(quickPicker.selectedItems[0].description)

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
		activateSignal.resolve(ctx)
		ctx.subscriptions.push(cmd)
	},
	deactivate() {
		deactivateSignal.resolve()
		statusBarItem.dispose()
	}
}

Promise.allSettled(scriptFiles).then((resolvedScripts) => {
	// when script file found = script { fs.stats, path, workspaceName }
	// 		then await for activation & deactivation signal
	//
	// when script file not found = reason { path, workspaceName } 
	// 		then ask if user want to creact a script file
	//  	     if Create & (!in `ignoreScripts`):
	//				writeFile then  openTextFile
	//			 else Later:
	//				add script path to `ignoreScripts`					  
	for (let { value: script, reason } of resolvedScripts)
		if (reason?.path)
			Script.onActivate(async ctx => {
				let { path, workspaceName } = reason
				let dir = path.replace("main.js", "") // directory of script file.
				let ignoreScripts = ctx.workspaceState.get("ignoreScripts") || []
				if (ignoreScripts.includes(path)) return

				let stats = await checkFileOrDirectory(dir, workspaceName)

				if (stats.isDirectory()) {
					let is = await window.showInformationMessage(`Want to create a script for ${workspaceName}?\n ${path}`, "Create", "Later")
					if (is == "Later")
						return ctx.workspaceState.update("ignoreScripts", [...ignoreScripts, path])
					if (is == "Create") {
						await writeFile(path, example)
						openTextFile(path)
					}
				}
			}).catch(() => { })

		else if (script?.isFile()) {
			try {
				runingScript.push({ path: script.path, name: script.workspaceName })

				let { activate, deactivate } = require(script.path)
				typeof activate == "function" &&
					Script.onActivate(activate).catch(printErr)

				typeof activate == "function" &&
					Script.onDeactivate(deactivate).catch(printErr)

			} catch (err) { window.showErrorMessage(err?.message) }
		}
})

let example = `/// <reference path="${extensionPath.replace(/\\/g, "/")}/global.d.ts" />
// API - https://code.visualstudio.com/api/references/vscode-api 
// reload window after edit...

window.showInformationMessage('Hello World!')
`
