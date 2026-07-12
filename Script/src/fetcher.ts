import * as fs from "fs";
import * as path from "path";
import * as menager from "./menager";
import { createBoilerPlate } from "./example";
import { RegistryState, Script } from "./types";
import { getSetting, show, showErrMsg } from "./utils";

// This Promise resolve, When all scriptfile resolve,
const resolved: Promise<any>[] = [];
const mainPath = getSetting<string>('main') || ".vscode/main.js";
const isSuggestCreate = getSetting<boolean>('suggestCreateScript');

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

export async function onFinishedFetching() {
    await Promise.all(resolved)
}

function addScriptFile({ filepath, name }: Script) {
    menager.allow({ filepath, name })
}

export function suggestCreateScript(script: Script) {
    const exclude = () => menager.exclude(script);
    // if it meet following logic 
    // Not to suggest user for creation a script,
    if (!isSuggestCreate || menager.getOldState(script) == RegistryState.exclude) {
        return exclude();
    }
    return show.infoMsg(`Create script. (${script.name}) ${script.filepath}`, {
        Create: () => {
            menager.allow(script);
            createBoilerPlate(script.filepath);
        },
        Deny: exclude,
        _: exclude,
    });
}
