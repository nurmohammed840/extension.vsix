/// <reference path="./global.d.ts" />
// @ts-check
// Feel free to modify, If you break something.
// Just Reinstall this extention. :)
const vscode = require('vscode');
Object.assign(globalThis, vscode);
globalThis.vscode = vscode;
const
	util = require('util'),
	path = require('path'),
	fs = require('fs').promises,
	outputChannel = window.createOutputChannel('Script'),
	{ extensionPath } = extensions.getExtension('nur.script'),
	defaultPath = workspace.getConfiguration('script').get('path'),
	/** scriptFiles : Promice<{filepath:string,name:string}[]> */
	scriptFiles = [];

// -------------------------------------------------------------------

function openTextFile(...filepath) {
	return workspace
		.openTextDocument(Uri.file(path.join(...filepath)))
		.then(window.showTextDocument);
}
function printErr(err) {
	outputChannel.appendLine('\n' + util.inspect(err));
	window.showErrorMessage(err?.message);
}
function deferred() {
	let methods;
	const promise = new Promise((resolve, _reject) => {
		methods = { resolve };
	});
	return Object.assign(promise, methods);
}
function addScript(name, ...directorys) {
	const filepath = path.join(...directorys, 'main.js');
	const promise = fs.stat(filepath)
		.then(stats => ({ filepath, name, stats }))
		.catch(() => Promise.reject({ filepath, name }));
	scriptFiles.push(promise);
}
// ------------------------ Await For Signal -------------------------

const activateSignal = deferred();
const deactivateSignal = deferred();

// --------------------------  API  ----------------------------------
// @ts-ignore
globalThis.Context = activateSignal;
globalThis.Script = {
	onActivate: fn => activateSignal.then(fn),
	onDeactivate: fn => deactivateSignal.then(fn),
	output(method, option = false) {
		if (method == 'show') outputChannel.show(option);
		else if (method == 'hide') outputChannel.hide();
		else if (method == 'clear') outputChannel.clear();
	},
};
globalThis.print = (data) => outputChannel.append(util.inspect(data));
globalThis.println = (data) => outputChannel.appendLine(util.inspect(data));

//-------------------  Add Script Files (main.js) --------------------

if (defaultPath) addScript('Default', defaultPath);

if (workspace.workspaceFolders)
	for (const folder of workspace.workspaceFolders)
		addScript(folder.name, folder.uri.fsPath, '.vscode');

//----------------------------- Quick Picker ------------------------

const quickPicker = window.createQuickPick();
const quickPickerItems = [
	{ label: 'Show Output', priority: 0, fn() { outputChannel.show(true); }, },
	{ label: 'Clear Output', priority: 0, fn() { outputChannel.clear(); }, },
	{ label: 'Open Config File', priority: 0, fn() { openTextFile(extensionPath, 'package.json'); }, },
];
quickPicker.matchOnDescription = true;
quickPicker.onDidAccept(async () => {
	try {
	/**@type {PickerOption} */
		// @ts-ignore
		const selected = quickPicker.activeItems[0];
		selected.priority++;
		quickPicker.placeholder = selected.label;
		// @ts-ignore
		if (selected.busy) quickPicker.busy = selected;
		if (quickPicker.busy === false) quickPicker.hide();
		await selected.fn();
		// @ts-ignore
		if (quickPicker.busy === selected) quickPicker.hide();
	} catch (err) {
		printErr(err);
	}
});

function showPicker() {
	quickPicker.items = quickPickerItems.sort((a, b) => a.priority > b.priority && -1);
	quickPicker.busy = false;
	quickPicker.show();
}
// Checking strictly
function picker(any, fn, priority = 0) {
	if (typeof any == 'string' && typeof fn == 'function')
		quickPickerItems.push({ label: any, priority, fn });
	else if (typeof any == 'object') {
		const { label, priority, fn, busy, description, detail, alwaysShow } = any;
		if (typeof label == 'string' && typeof fn == 'function') {
			const obj = { label, priority: typeof priority == "number" ? priority : 0, fn };
			if (typeof busy == 'boolean') obj.busy = busy;
			if (typeof detail == 'string') obj.detail = detail;
			if (typeof alwaysShow == 'boolean') obj.alwaysShow = alwaysShow;
			if (typeof description == 'string') obj.description = description;
			quickPickerItems.push(obj);
		}
	}
	return () => quickPickerItems.splice(quickPickerItems.length, 1);
}
picker.show = showPicker;
picker.hide = () => quickPicker.hide();
picker.onDidHide = quickPicker.onDidHide.bind(quickPicker);
picker.onDidAccept = quickPicker.onDidAccept.bind(quickPicker);
picker.onDidChangeValue = quickPicker.onDidChangeValue.bind(quickPicker);
picker.value = (v) => v === undefined ? quickPicker.value : quickPicker.value = v;

globalThis.Script.picker = picker; // API

// ----------------------- Command And StatusBarItem -----------------

const cmd = commands.registerCommand('script.showPicker', showPicker);
const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 10000);
statusBarItem.text = ' Script ';
statusBarItem.color = '#0ff';
statusBarItem.command = 'script.showPicker';
statusBarItem.show();

// -------------------------------------------------------------------

module.exports = {
	activate(ctx) {
		activateSignal.resolve(ctx);
	},
	deactivate() {
		deactivateSignal.resolve();
		statusBarItem.dispose();
		outputChannel.dispose();
		quickPicker.dispose();
		cmd.dispose();
	},
};

Promise.allSettled(scriptFiles).then(settledScriptFiles => {
	for (const result of settledScriptFiles)
		if (result.status == 'rejected')
			activateSignal.then(async ctx => {
				const { filepath, name } = result.reason;
				const ignoreScripts = ctx.workspaceState.get('ignoreScripts') || [];

				if (ignoreScripts.includes(filepath)) return;

				const is = await window.showInformationMessage(`Want to create a script for ${name}?\n\n\t${filepath}`,
					'Create',
					'Later'
				);
				if (is == 'Later')
					ctx.workspaceState.update('ignoreScripts', [...ignoreScripts, filepath]);
				if (is == 'Create') {
					await fs.mkdir(path.dirname(filepath), { recursive: true });
					await fs.writeFile(filepath, example, { encoding: 'utf-8' });
					openTextFile(filepath);
				}
			}).catch(printErr);

		else if (result.value.stats.isFile()) try {
			const { filepath, name } = result.value;
			const { activate, deactivate } = require(filepath);

			picker({
				label: name,
				description: filepath,
				fn: () => openTextFile(filepath)
			});

			if (typeof activate == 'function')
				activateSignal.then(activate).catch(printErr);
			if (typeof deactivate == 'function')
				deactivateSignal.then(deactivate).catch(printErr);

		} catch (err) { printErr(err); }
});

const example = `/// <reference path="${path.join(extensionPath, 'global.d.ts').replace(/\\/g, '/')}" />
// API - https://code.visualstudio.com/api/references/vscode-api 
// 'Reload Window' or 'Restart Extension Host' after edit...

window.showInformationMessage('Hello World!')`;