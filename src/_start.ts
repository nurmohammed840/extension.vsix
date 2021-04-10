/// <reference path="../@types/api.global.d.ts" />
/// <reference path="../@types/vscode.global.d.ts" />
// This is the main entry point.

Object.assign(globalThis, require("vscode"));

// Started fatching script, It will provide data to the `menager`,
// Basically it power `menager`.
import "./fetcher";

import * as menager from "./menager";
import { Executor } from "./executor";
import { onFinishedFetching } from "./fetcher";
import { quickPicker, showPicker, picker } from "./quickPicker";
import { outputChannel, output, print, println } from "./outputChannel";
import { deferred, openTextFile, show, showErrMsg, } from "./utils";
import { createBoilerPlate } from "./example";

const cmd = commands.registerCommand('script.showPicker', showPicker);
const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 1000);

statusBarItem.text = ' Script ';
statusBarItem.color = '#0ff';
statusBarItem.command = 'script.showPicker';
statusBarItem.tooltip = " Script ";
statusBarItem.show();

// Exposed some utility functions, Globally.
globalThis.show = show;
globalThis.output = output;
globalThis.picker = picker;
globalThis.print = print;
globalThis.println = println;
globalThis.showErrMsg = showErrMsg;
globalThis.openTextFile = openTextFile;

// Creating a defer object of ExtensionContext
const deferContext = deferred<ExtensionContext>();

export function activate(context: ExtensionContext) {
    deferContext.resolve(context);
}

const executor = new Executor(deferContext);

// -----------------------------------------------------------------------
// Todo: Need to refactor code: better organized and more readbility... 
let revaluatePickerItem: PickerItem[] = [];
let createScriptPickerItem: PickerItem[] = [];

const revaluate = picker("Revaluate", () => {
    quickPicker.items = revaluatePickerItem;
    quickPicker.show();
});
const createScript = picker("Create Script", () => {
    quickPicker.items = createScriptPickerItem;
    quickPicker.show();
});

revaluate.hide = true;
createScript.hide = true;

menager.onChange(() => {
    const Scripts = menager.getRegisteredScripts();
    // Updataing PickerItem by replace it, rather then mutation,
    // For simplicity sake 
    revaluatePickerItem = Scripts.allowed.map(script => ({
        label: script.name,
        detail: script.filepath,
        fn() { executor.revaluate(script) }
    }))

    createScriptPickerItem = Scripts.exclude.map(script => ({
        label: script.name,
        detail: script.filepath,
        fn() {
            menager.allow(script)
            return createBoilerPlate(script.filepath);
        }
    }));

    revaluate.hide = !revaluatePickerItem.length ? true : false;
    createScript.hide = !createScriptPickerItem.length ? true : false;
});

// ---------------------------------------------------------------------------------

onFinishedFetching().then(() => {
    const Scripts = menager.getRegisteredScripts();
    for (const script of Scripts.allowed) {
        executor.runScript(script.filepath);
    }
});

export function deactivate() {
    menager.saveRegistry();
    // Dispose every resources, When the kernel is deactivated.
    statusBarItem.dispose();
    outputChannel.dispose();
    quickPicker.dispose();
    executor.disposeAll();
    cmd.dispose();
}
