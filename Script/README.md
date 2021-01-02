# Script
Script is a zero dependencie extension that allow you to run [Visual-Studio-Code API](https://code.visualstudio.com/api/references/vscode-api) as a script.

## API
All [Visual-Studio-Code API](https://code.visualstudio.com/api/references/vscode-api) used globaly. It also has some Api.
- `print(msg:string): void`: Print message to Output.
- `println(msg:string): void`: Print to Output with newline.
- `Context`: get Promice.resolve(ExtensionContext).
#### Script
- `output(method: 'clear' | 'hide' | 'show')`: show, hide and clear output programmatically.
- `picker(label: string, fn: () => void): cleanUp` : Add event to picker
- `picker(scriptPickerOption: ScriptPickerOption): cleanUp` : Add event to picker
- `onActivate(fn: (ctx: ExtensionContext) => any): Promise<any>` : Add event listener on extension activate.
- `onDeactivate(fn: () => void)` : Add event listener on extension deactivate.

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

**Happy Hacking!**
