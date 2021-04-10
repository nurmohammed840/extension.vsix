import { promises as fs, readFileSync } from "fs";
import * as path from "path";
import { Registry, RegistryState, Script } from "./types";
import { extensionPath, showErrMsg } from "./utils";
import { println } from "./outputChannel";

let registry: Registry = {};
const scriptpath: string[] = [];
const registryFilePath = path.join(extensionPath, "__Registry__.json");

try {
    registry = JSON.parse(readFileSync(registryFilePath).toString());
} catch (error) {
    if (error?.code != 'ENOENT') showErrMsg(error);
    fs.writeFile(registryFilePath, "{}").catch(showErrMsg);
}

// private function
function _addScriptpath(filepath: string) {
    if (!scriptpath.includes(filepath)) {
        scriptpath.push(filepath);
    }
}

export function getState({ filepath, name }: Script) {
    _addScriptpath(filepath);
    const some = registry[filepath];
    return some
        ? some.name == name
            ? some.state    // RegistryState
            : null          // If name not match
        : undefined;        // If entry not found
}

export function saveRegistry() {
    println("awwsss")
    fs.writeFile(registryFilePath, JSON.stringify(registry, null, 1), { encoding: "utf-8" }).catch(showErrMsg);
}

export function allow({ filepath, name }: Script) {
    println({ filepath, name })
    _addScriptpath(filepath);
    registry[filepath] = { name, state: RegistryState.allowed };
}
export function ignore({ filepath, name }: Script) {
    _addScriptpath(filepath);
    registry[filepath] = { name, state: RegistryState.ignored };
}
export function exclude({ filepath, name }: Script) {
    _addScriptpath(filepath);
    registry[filepath] = { name, state: RegistryState.exclude };
}

export function onExclude(_fn: (script: Script) => void) {

}

export function getByType(state: RegistryState) {
    const results: Script[] = [];
    for (const filepath of scriptpath) {
        const item = registry[filepath];
        if (item && state == item.state) results.push({ filepath, name: item.name })
    }
    return results;
}
