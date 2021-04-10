import * as fs from "fs";
import * as path from "path";
import * as menager from "./menager";
import { createBoilerPlate } from "./example";
import { RegistryState, Script } from "./types";
import { getSetting, show, showErrMsg } from "./utils";

// This Promise resolve, When all scriptfile resolve,
const resolved: Promise<any>[] = [];
const mainPath = getSetting<string>('main') || ".vscode/main.js";
const isSuggestCreateScript = getSetting<boolean>('suggestCreateScript');

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
    switch (menager.getOldState({ filepath, name })) {
        case RegistryState.ignored: return menager.ignore({ filepath, name })
        case RegistryState.allowed: return menager.allow({ filepath, name })
        // When script is create, its `ignored` by default,
        // But if user modify `__Registry__.json` then,
        // We still `ignore` script even its `exclude`, Becouse we found script.
        case RegistryState.exclude: return menager.ignore({ filepath, name })
    }
    return show.infoMsg(`Permission needed to run script. (${name}) ${filepath}`, {
        Allow: () => menager.allow({ filepath, name }),
        Ignore: () => menager.ignore({ filepath, name })
    });
}

export function suggestCreateScript(script: Script, force = false) {
    const exclude = () => menager.exclude(script);
    //`suggestCreateScript` also called internally, where `force` could be `true`
    // So no matter what, script `exclude` or whatever,
    // suggest user for creation a script...
    if (!force && (!isSuggestCreateScript || menager.getOldState(script) == RegistryState.exclude)) {
        // if it meet following logic 
        // Not to suggest user for creation a script,
        return exclude();
    }
    return show.infoMsg(`Create a script. (${script.name}) ${script.filepath}`, {
        Create: () => {
            menager.ignore(script);
            createBoilerPlate(script.filepath);
        },
        Deny: exclude,
        _: exclude
    });
}
