/// <reference path="../@types/api.global.d.ts" />
/// <reference path="../@types/vscode.global.d.ts" />
// This is the main entry point.

Object.assign(globalThis, require("vscode"));

import * as menager from "./menager";
import { Executor } from "./executor";
import { RegistryState } from "./types";
import { fetchScripts } from "./fetcher";
import { createBoilerPlate } from "./example";
import { outputChannel } from "./outputChannel";
import { quickPicker, showPicker } from "./quickPicker";
import { deferred, openTextFile, show, showErrMsg, } from "./utils";

const cmd = commands.registerCommand('script.showPicker', showPicker);
const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 1000);

statusBarItem.text = ' Script ';
statusBarItem.color = '#0ff';
statusBarItem.command = 'script.showPicker';
statusBarItem.tooltip = " Script ";
statusBarItem.show();

// Exposed some utility functions, Globally.
globalThis.show = show;
globalThis.showErrMsg = showErrMsg;
globalThis.openTextFile = openTextFile;

// Creating a defer object of ExtensionContext
const deferContext = deferred<ExtensionContext>();

export function activate(context: ExtensionContext) {
    deferContext.resolve(context);
}

const executor = new Executor(deferContext);

fetchScripts().then(() => {
    const excludeScripts = menager.getByType(RegistryState.exclude);
    const allowedScripts = menager.getByType(RegistryState.allowed);
    const ignoredScripts = menager.getByType(RegistryState.ignored);

    for (const script of allowedScripts) {
        executor.runScript(script.filepath);
    }
    if (excludeScripts.length != 0) {
        const removeCreate_Script = picker("Create Script", () => {
            const pickerItems: PickerItem[] = [];
            for (const script of excludeScripts) pickerItems.push({
                label: script.name,
                detail: script.filepath,
                busy: true,
                fn() {
                    ignoredScripts.push(script);
                    excludeScripts.splice(excludeScripts.indexOf(script), 1);
                    if (!excludeScripts.length) removeCreate_Script();
                    return createBoilerPlate(script);
                }
            });
            quickPicker.items = pickerItems;
            quickPicker.show();
        });
    }
    if (allowedScripts.length || ignoredScripts.length) picker("Revaluate", () => {
        const pickerItems: PickerItem[] = [];
        for (const script of allowedScripts) pickerItems.push({
            label: script.name,
            detail: script.filepath,
            fn() { executor.revaluate(script) }
        });
        for (const script of ignoredScripts) pickerItems.push({
            label: script.name,
            detail: script.filepath,
            description: 'ignored',
            fn() {
                menager.allow(script);
                allowedScripts.push(script);
                executor.revaluate(script);
                ignoredScripts.splice(ignoredScripts.indexOf(script), 1);
            }
        });

        if (allowedScripts.length == 1 && pickerItems.length == 1) return pickerItems[0]?.fn();

        quickPicker.items = pickerItems;
        quickPicker.show();
    });
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
