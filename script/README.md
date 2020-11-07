# Script

Is a extension that allow you to run Visual-Studio-Code API as a script.

## Example

We want to run this script. path `${workspace}/.vscode/script.js`

```js 
// script.js
// Visual-Studio-Code API used globaly.

function activate(context) {
     // This line of code will only be executed once when your script is activated
	window.showInformationMessage('Hello World!');
}
// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
```

## Requirements

 - Install Extention.
 - Create a folder named `.vscode` in your workspace.
 - Create a file named `script.js` in `.vscode` folder. 
 - Reload Window. 

## Script Settings
 - `script.path: string | ""` Always resolve file from this folder. Default `${workspace}/.vscode`.
 - `script.main: string` Name of the main file to run.( index.js, main.js ... )

### For more information

* [Script Repository](https://github.com/nurmohammed840/VSC.ext/tree/master/script)
* [Visual Studio Code's API](https://code.visualstudio.com/api/references/vscode-api)

**Happy Hacking!**
