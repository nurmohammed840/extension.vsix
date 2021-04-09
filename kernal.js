/// <reference path="./@types/api.global.d.ts" />
/// <reference path="./@types/vscode.global.d.ts" />
Object.assign(globalThis, require('vscode'));
globalThis.console = undefined;
const fs = require('fs').promises;
const path = require('path');
const defaultPath = workspace.getConfiguration('script').get('path');
const scriptFiles = [];
const scriptDeactivators = [];

//-------------------  Add Script Files (main.js) --------------------

function addScript(name, ...directorys) {
    const filepath = path.join(...directorys, 'main.js');
    const promise = fs.stat(filepath)
        .then(stats => ({ filepath, name, stats }))
        .catch(() => Promise.reject({ filepath, name }));
    scriptFiles.push(promise);
}

if (defaultPath) addScript('Default', defaultPath);

if (workspace.workspaceFolders)
    for (const folder of workspace.workspaceFolders)
        addScript(folder.name, folder.uri.fsPath, '.vscode');

//----------------------------------------------------------------------------------------------------------------------------

/** @type {ExtensionContext} */
let extensionContext;

function runAllScriptFiles() {
    const allowedScriptFiles = extensionContext.workspaceState.get('allowedScripts') ?? [];
    for (const scriptFile of allowedScriptFiles) {
        runScriptFile(scriptFile)
    }
}

function runScriptFile({ name, filepath }) {
    const allowedScriptFiles = extensionContext.workspaceState.get('allowedScripts') ?? [];
    try {
        const { activate, deactivate } = require(filepath);
        picker({
            label: name,
            description: filepath,
            fn: () => openTextFile(filepath)
        });

        if (typeof activate == 'function')
            Promise.resolve(activate(extensionContext)).catch(showErrMsg);
        if (typeof deactivate == 'function')
            scriptDeactivators.push({ name, filepath, deactivate });

    } catch (error) {
        if (error?.code == "MODULE_NOT_FOUND") {
            extensionContext.workspaceState.update('allowedScripts', allowedScriptFiles.filter(script => {
                if (script.name != name && script.filepath != filepath)
                    return script
            }))
        }
    }
}

function runAllScriptDeactivators() {
    for (const { deactivate } of scriptDeactivators) {
        Promise.resolve(deactivate).catch(showErrMsg)
    }
}
// _start function
function activate(ctx) {
    //@ts-ignore
    extensionContext = globalThis.context = ctx; // API

    const ignoreScripts = ctx.workspaceState.get('ignoreScripts') ?? [];
    const allowedScriptFiles = ctx.workspaceState.get('allowedScripts') ?? [];

    runAllScriptFiles();

    Promise.allSettled(scriptFiles).then(async settledScriptFiles => {
        for (const result of settledScriptFiles) {
            try {
                if (result.status == 'rejected') {
                    const { filepath, name } = result.reason;
                    if (ignoreScripts.includes(filepath)) continue;

                    const is = await window.showInformationMessage(`Create a script for ${name}?\n\t${filepath}`,
                        'Create',
                        'Deny'
                    );
                    if (is == 'Deny')
                        ctx.workspaceState.update('ignoreScripts', [...ignoreScripts, filepath]);
                    if (is == 'Create') {
                        const jsconfigPath = path.join(path.dirname(filepath), "./jsconfig.json");
                        await fs.mkdir(path.dirname(filepath), { recursive: true });
                        await Promise.all([
                            fs.writeFile(filepath, example, { encoding: 'utf-8' }),
                            fs.writeFile(jsconfigPath, JSON.stringify(jsonConfig, null, 4), { encoding: 'utf-8' })
                        ]);
                        ctx.workspaceState.update('allowedScripts', [...allowedScriptFiles, { name, filepath }]);
                        openTextFile(filepath);
                    }
                }
                else if (result.value.stats.isFile()) {
                    const { filepath, name } = result.value;
                    const isAllowed = allowedScriptFiles.some(scriptFile => scriptFile.filepath == filepath && scriptFile.name == name);
                    if (isAllowed) continue;

                    const is = await window.showInformationMessage(`Permission needed to run script for ${name}.\n\t${filepath}`,
                        'Allow',
                        'Deny'
                    );
                    if (is == 'Deny')
                        ctx.workspaceState.update('ignoreScripts', [...ignoreScripts, filepath]);
                    if (is == 'Allow') {
                        ctx.workspaceState.update('allowedScripts', [...allowedScriptFiles, { name, filepath }]);
                        runScriptFile({ filepath, name });
                    }
                }
            } catch (error) { showErrMsg(error) }
        }
    });
}