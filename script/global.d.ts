import vsc from "vscode";
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
    var authentication: typeof vsc.authentication
}