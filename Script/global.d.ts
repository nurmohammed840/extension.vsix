// Please help to improve and write global.d.ts for vscode.
// I don't know how to generate gloal version of type file from vscode.d.ts 

import vsc from "vscode";
import type vscode from "vscode";

declare global {
    var env: typeof vsc.env
    var scm: typeof vsc.scm
    var debug: typeof vsc.debug
    var tasks: typeof vsc.tasks
    var window: typeof vsc.window
    var commands: typeof vsc.commands
    var comments: typeof vsc.comments
    var workspace: typeof vsc.workspace
    var languages: typeof vsc.languages
    var extensions: typeof vsc.extensions
    var authentication: typeof vsc.authentication;

    var Uri: typeof vsc.Uri;
    var StatusBarAlignment: typeof vsc.StatusBarAlignment;

    var Context: Promise<vscode.ExtensionContext>;
    var Script: {
        /**
         * Listen onActivate.
         * You can also use it to get `ExtensionContext`
         */
        onActivate: (fn: (ctx: vscode.ExtensionContext) => any) => Promise<any>,
        /** This Event run when the Extention is deactivated */
        onDeactivate: (fn: () => void) => void,
        /** `show`, `hide` and `clear` ourput programmatically */
        output: (method: 'show' | 'hide' | 'clear') => void
    }
    /** Print message to `output` */
    function print(msg?: any): void;
    /** Print to `Output` with newline. */
    function println(msg?: any): void;
};
