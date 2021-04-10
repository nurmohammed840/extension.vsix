import { promises as fs, readFileSync } from "fs";
import * as path from "path";
import { Registry, RegistryState, Script } from "./types";
import { extensionPath, showErrMsg } from "./utils";


let newRegistry: Registry = {};
let oldRegistry: Registry = {};
const eventListaner: (() => void)[] = [];
const registryFilePath = path.join(extensionPath, "__Registry__.json");

try {
    oldRegistry = JSON.parse(readFileSync(registryFilePath).toString());
} catch (error) {
    if (!(error?.code == 'ENOENT' || error?.code == "MODULE_NOT_FOUND")) showErrMsg(error?.code);
    fs.writeFile(registryFilePath, "{}").catch(showErrMsg);
}

export function saveRegistry() {
    const mergedRegistry = JSON.stringify(Object.assign(oldRegistry, newRegistry), null, 1);
    fs.writeFile(registryFilePath, mergedRegistry, { encoding: "utf-8" }).catch(showErrMsg);
}

async function _executeListeners() {
    for (const fn of eventListaner) {
        try {
            await fn();
        } catch (error) {
            showErrMsg(error);
        }
    }
}

export function allow({ filepath, name }: Script) {
    newRegistry[filepath] = { name, state: RegistryState.allowed };
    _executeListeners();
}
export function ignore({ filepath, name }: Script) {
    newRegistry[filepath] = { name, state: RegistryState.ignored };
    _executeListeners();
}
export function exclude({ filepath, name }: Script) {
    newRegistry[filepath] = { name, state: RegistryState.exclude };
    _executeListeners();
}

export function onChange(fn: () => void) {
    eventListaner.push(fn);
}

export function getOldState({ filepath, name }: Script) {
    const some = oldRegistry[filepath];
    return some
        ? some.name == name
            ? some.state    // RegistryState
            : null          // If name not match
        : undefined;        // If entry not found
}

export function getByType(from = "new") {
    const results: Record<'allowed' | 'exclude' | 'ignored', Script[]> = {
        allowed: [],
        exclude: [],
        ignored: []
    }
    for (const [filepath, { name, state }] of Object.entries(from == "new" ? newRegistry : oldRegistry)) {
        switch (state) {
            case RegistryState.allowed: results.allowed.push({ filepath, name });
                break
            case RegistryState.exclude: results.exclude.push({ filepath, name })
                break
            case RegistryState.ignored: results.ignored.push({ filepath, name })
        }

    }
    return results;
}
