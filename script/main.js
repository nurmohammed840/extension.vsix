//@ts-check
/// <reference path="./global.d.ts" />
Object.assign(globalThis, require('vscode'));
const fs = require('fs');
let { writeFile, checkFileOrDirectory, deferred } = require("./utils");


let { workspaceFolders } = workspace;
let { path } = workspace.getConfiguration("script");
let runingScript = [], scriptFiles = [];

let activateSignal = deferred()
let deactivateSignal = deferred()

class Script {
	/** @param {(ctx:ExtensionContext)=>void} fn */
	static onActivate(fn) {
		return activateSignal.then(fn);
	}
	static onDeactivate(fn) {
		return deactivateSignal.then(fn);
	}
}

globalThis.Script = Script;

function addScript(directory) { scriptFiles.push(checkFileOrDirectory(directory + "\\.vscode\\main.js")); }

path && addScript(path);

if (workspaceFolders)
	for (let folder of workspaceFolders)
		addScript(folder.uri.fsPath)

let printErr = (err) => window.showErrorMessage(err?.message)

Promise.allSettled(scriptFiles).then((resolvedScripts) => {
	//@ts-ignore
	for (let { value: script, reason: path } of resolvedScripts)
		if (path)
			Script.onActivate(async ctx => {
				let dir = path.replace("main.js", "");
				let ignoreScripts = ctx.workspaceState.get("ignoreScripts") || [];
				if (ignoreScripts.includes(path)) return

				let stats = await checkFileOrDirectory(dir);

				if (!stats.isDirectory()) return

				let is = await window.showInformationMessage("Want to create a Script?\t" + path, "Create", "Later")
				if (is == "Later")
					return ctx.workspaceState.update("ignoreScripts", [...ignoreScripts, path])
				if (is == "Create") {
					await writeFile(path, example)
					workspace.openTextDocument(Uri.file(path)).then(window.showTextDocument)
				}
			}).catch(() => { })

		else if (script?.isFile()) {
			try {
				runingScript.push(script.path);

				let { activate, deactivate } = require(script.path);
				typeof activate == "function" &&
					Script.onActivate(activate).catch(printErr);

				typeof activate == "function" &&
					Script.onDeactivate(deactivate).catch(printErr);

			} catch (err) { window.showErrorMessage(err?.message) }
		}
}).then(() => window.showInformationMessage(runingScript.length + "\tScript Runing!"))



module.exports = {
	activate(ctx) {
		activateSignal.resolve(ctx);
	},
	deactivate() {
		deactivateSignal.resolve()
	}
};

let example = `/// <reference path="${extensions.getExtension("nur.script").extensionPath.replace(/\\/g, "/")}/global.d.ts" />
// API - https://code.visualstudio.com/api/references/vscode-api 
// reload window after edit...

window.showInformationMessage('Hello World!');
`

