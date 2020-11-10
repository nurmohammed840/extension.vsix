# Script

Is a extension that allow you to run Visual-Studio-Code API as a script.

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
 - `script.path: string | null`: Default path directory.Where Script Extention should check for default script and configration.

## Use Cases

 1. Good number of extension slow down  editor...
 2. Vscode powerby NodeJS, It isn't secure like a browser or [deno](https://github.com/denoland/deno)</br></br>
So you can't relay on so many 3rd party extention.</br></br>
This is a zero dependency module.There are many use cases,like run commend `onSave` event.</br>
Good for your typescript compilation! :)

<!-- This is zero a dependency module. -->

### For more information

* [Just Black](https://marketplace.visualstudio.com/items?itemName=nur.just-black)
* [Script Repository](https://github.com/nurmohammed840/VSC.ext)
* [Visual Studio Code's API](https://code.visualstudio.com/api/references/vscode-api)

**Happy Hacking!**
