import * as fs from "fs";
import * as path from "path";
import * as menager from "./menager";
import { createBoilerPlate } from "./example";
import { RegistryState, Script } from "./types";
import { getSetting, show, showErrMsg } from "./utils";

// This Promise resolve, When all scriptfile resolve,
const resolved: Promise<any>[] = [];
const mainPath = getSetting<string>('main') || ".vscode/main.js";
const shouldSuggestCreateScript = getSetting<boolean>('suggestCreateScript');

if (workspace.workspaceFolders) {
    for (const { name, uri } of workspace.workspaceFolders) {
        const filepath = path.join(uri.fsPath, mainPath);
        const promise = fs.promises.stat(filepath)
            .then(stats => <any>stats.isFile() && addScriptFile({ filepath, name }))
            .catch(() => suggestCreateScript({ filepath, name }))
            .catch(showErrMsg);

        resolved.push(promise);
    }
}

export function fetchScripts() {
    return Promise.all(resolved).then(() => menager);
}

function addScriptFile({ filepath, name }: Script) {
    switch (menager.getState({ filepath, name })) {
        case RegistryState.ignored: return
        case RegistryState.allowed: return menager.allow({ filepath, name })
        case RegistryState.exclude: return menager.ignore({ filepath, name })
        default: return show.infoMsg(`Permission needed to run script. (${name}) ${filepath}`, {
            Allow: () => menager.allow({ filepath, name }),
            Ignore: () => menager.ignore({ filepath, name })
        });
    }
}

export function suggestCreateScript({ filepath, name }: Script, force = false) {
    if (!force) {
        if (!shouldSuggestCreateScript) return
        if (menager.getState({ name, filepath }) == RegistryState.exclude) return
    }

    return show.infoMsg(`Create a script. (${name}) ${filepath}`, {
        Create: () => createBoilerPlate({ filepath, name }),
        Deny() { menager.exclude({ filepath, name }) },
        _() { menager.exclude({ filepath, name }) }
    });
}
