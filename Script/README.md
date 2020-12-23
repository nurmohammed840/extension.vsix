# Script
Vscode is one of the most powerful text-editor writen in typescript.

Script is a zero dependencie extension that allow you to run Visual-Studio-Code API as a script.

## API
All Visual-Studio-Code API used globaly.It also has some Api.
```js
// Vscode has no console.But has a Output system.
printLn('Print to `Output` with newline.');
print('Print message to `Output`');

// get `ExtensionContext`
let ctx = await Context;

// `show`, `hide` and `clear` output programmatically.
Script.output("clear" || "hide" || "show");
```

## Example

We want to run this script. path `${workspace}/.vscode/main.js`

```js 
// All Visual-Studio-Code API used globaly.
function activate(context) {
     // This line of code will only be executed once when your script is activated
	window.showInformationMessage('Hello World!');
}
// this method is called when your extension is deactivated
function deactivate() {}

module.exports = { activate, deactivate }
```

## Requirements

 - Create a folder named `.vscode` in your workspace.
 - Create a file named `main.js` in `.vscode` folder. 
 - Reload Window. 

## Script Settings
 - `script.path: string | null` : Default main script directory.


### For more information

* [Just Black](https://marketplace.visualstudio.com/items?itemName=nur.just-black)
* [Script Repository](https://github.com/nurmohammed840/VSC.ext)
* [Visual Studio Code's API](https://code.visualstudio.com/api/references/vscode-api)

Please Help me by collaboration, create new issue,Make some npm libirary for vscode api.

**Happy Hacking!**
