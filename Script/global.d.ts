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

    type ExtensionContext = vscode.ExtensionContext
};
