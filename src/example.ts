import { promises as fs } from "fs";
import * as path from "path";
import * as menager from "./menager";
import { Script } from "./types";
import { extensionPath } from "./utils";


export async function createBoilerPlate({ name, filepath }: Script) {
    menager.ignore({ filepath, name });
    const jsConfigPath = path.join(path.dirname(filepath), "./jsconfig.json");
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await Promise.all([
        fs.writeFile(filepath, example, { encoding: 'utf-8' }),
        fs.writeFile(jsConfigPath, JSON.stringify(jsConfig, null, 4), { encoding: 'utf-8' })
    ]);
    return openTextFile(filepath);
}

const example = `/// <reference path="${path.join(extensionPath, '@types/vscode.global.d.ts').replace(/\\/g, '/')}" />
/// <reference path="${path.join(extensionPath, '@types/api.global.d.ts').replace(/\\/g, '/')}" />
//  @ts-check
//  API: https://code.visualstudio.com/api/references/vscode-api
// 'Reload Window' or 'Restart Extension Host' after edit...

function activate(_context) {
   window.showInformationMessage('Hello World!');
}

function deactivate() {}

module.exports = { activate, deactivate }
`;

const jsConfig = {
    compilerOptions: {
        target: "esnext",
        lib: [
            "esnext"
        ]
    }
}


