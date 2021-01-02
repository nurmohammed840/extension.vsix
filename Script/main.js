//@ts-check
// Feel free to modify, If you break something.
// Just Reinstall this extention. :)
/// <reference path="./global.d.ts" />
Object.assign(globalThis, require('vscode'));
const
	fs = require("fs").promises,
	util = require("util"),
	{ join, dirname } = require("path"),
	{ extensionPath } = extensions.getExtension("nur.script"),
	defaultPath = workspace.getConfiguration("script").get("path"),
	outputChannel = window.createOutputChannel("Script"),
	openTextFile = (...filePath) => workspace.openTextDocument(Uri.file(join(...filePath))).then(window.showTextDocument),
	/** scriptFiles : Promice<{path:string,name:string}[]> */
	scriptFiles = [];

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
// --------------------- Await For Activation ------------------------
let activateSignal = deferred();
let deactivateSignal = deferred();
// --------------------------  API  ----------------------------------
globalThis.Context = deferred();
globalThis.Script = {
	onActivate(fn) {
		return activateSignal.then(fn);
	},
	onDeactivate(fn) {
		return deactivateSignal.then(fn);
	},
	output(method, option = false) {
		if (method == "show") outputChannel.show(option)
		else if (method == "clear") outputChannel.clear()
		else if (method == "hide") outputChannel.hide()
	}
}
globalThis.print = (data) => outputChannel.append(util.inspect(data));
globalThis.println = (data) => outputChannel.appendLine(util.inspect(data))
//-------------------  Add Script Files (main.js) --------------------

defaultPath && addScript("Default", defaultPath);

if (workspace.workspaceFolders)
	for (let folder of workspace.workspaceFolders)
		addScript(folder.name, folder.uri.fsPath, ".vscode");
//----------------------------- Quick Picker ------------------------

let quickPicker = window.createQuickPick();
const quickPickerItems = [
	{ label: "Show Output", priority: 0, fn() { outputChannel.show(true) } },
	{ label: "Clear Output", priority: 0, fn() { outputChannel.clear() } },
	{ label: "Open Config File", priority: 0, fn() { openTextFile(extensionPath, "package.json") } },
];
quickPicker.matchOnDescription = true;
// We are checking strictly.because user might use 'javascript'
function picker(any, fn, priority = 0) {
	const index = quickPickerItems.length;
	if (typeof any == "string" && typeof fn == "function")
		quickPickerItems.push({ label: any, priority, fn });
	else if (typeof any == "object") {
		let { label, priority, fn, busy, description, detail, alwaysShow } = any
		if (typeof label == "string" && typeof fn == "function") {
			const obj = { label, priority: priority ?? 0, fn }
			typeof busy == "boolean" && (obj.busy = busy)
			typeof detail == "string" && (obj.detail = detail)
			typeof alwaysShow == "boolean" && (obj.alwaysShow = alwaysShow)
			typeof description == "string" && (obj.description = description)
			quickPickerItems.push(obj);
		}
	}
	return () => quickPickerItems.splice(index, 1);
}
globalThis.Script.picker = picker // API
quickPicker.onDidAccept(async () => {
	try {
		/**@type {any} */
		let selected = quickPicker.activeItems[0];
		quickPicker.placeholder = selected.label;
		selected.priority++;
		//@ts-ignore
		if (selected.busy) quickPicker.busy = selected;
		if (quickPicker.busy === false) quickPicker.hide();
		await selected.fn();
		//@ts-ignore
		if (quickPicker.busy === selected) quickPicker.hide();
	} catch (err) {
		printErr(err);
	}
});

let cmd = commands.registerCommand("script.showPicker", () => {
	quickPicker.items = quickPickerItems.sort((a, b) => a.priority > b.priority && -1);
	quickPicker.busy = false;
	quickPicker.show();
});

let statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 10000);
statusBarItem.text = " Script ";
statusBarItem.color = "#0ff";
statusBarItem.command = "script.showPicker";
statusBarItem.show();

module.exports = {
	activate(ctx) {
		Context.resolve(ctx);
		activateSignal.resolve(ctx);
	},
	deactivate() {
		deactivateSignal.resolve();
		statusBarItem.dispose();
		outputChannel.dispose();
		quickPicker.dispose();
		cmd.dispose();
	}
}

Promise.allSettled(scriptFiles).then(resolvedScripts => {
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
			picker({ label: name, description: path, fn() { openTextFile(path) } })

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