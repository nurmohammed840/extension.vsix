// Feel free to modify, If you break something.
// Just Reinstall this extention. :)

let { path } = workspace.getConfiguration("script");
module.exports = {
    defaultConfig({ contributes, activationEvents } = {}) {
        if (!Array.isArray(activationEvents) || !activationEvents.length)
            activationEvents = ["*"];

        if (Object.prototype.toString.call(contributes) != "[object Object]")
            contributes = {}

        if (!("configuration" in contributes))
            contributes.configuration = {}
        if (!("properties" in contributes.configuration))
            contributes.configuration.properties = {}

        contributes.configuration.title = "Script"
        contributes.configuration.properties["script.path"] = {
            type: ["string", "null"],
            "scope": "resource",
            "default": path,
            "description": "Default path directory.Where Script Extention should check for default script and configration."
        }

        if (!("commands" in contributes))
            contributes.commands = [];

        let unique
        for (const { command } of contributes.commands)
            if (command == "script.statusBarItem") {
                unique = true;
                break;
            }

        if (unique)
            contributes.commands.push({ // do not use `script.statusBarItem` command.
                command: "script.statusBarItem",
                title: "Quick Open Script"
            })

        return { contributes, activationEvents }
    }
}