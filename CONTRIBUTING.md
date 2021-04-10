<img src="https://miro.medium.com/max/6400/1*xe9kgx33a2DHVV3tCjFp2Q.jpeg" alt="collaborate" width="450"/>

You can collaborate by:
- reporting bugs
- giving feedback
- feature request
- refactoring some code 
- improving documentation

### Development Setup

* Clone this repository : `git clone https://github.com/nurmohammed840/extension.vsix.git`
* Switch branch : `git switch Script`
* then run: `yarn` or `npm install`

For testing, simply tap `f5` or menually run `Launch Extension` in vscode debbuger.

That's it!

## Install From Source

Just run `node install`.

### Project Structure 

- `@types`
    - `api.global.d.ts`
    - `thenable.d.ts`
    - `vscode.global.d.ts`
<br>

- `src`
    - `_start.ts` - main entry point of kernal.
    - `example.ts` - example boilerplate
    - `executor.ts` - for executing script
    - `fetcher.ts` - for resolving script  
    - `menager.ts` - managing script files
    - `outputChannel.ts` - output interface
    - `quickPicker.ts` - picker interface
    - `types.ts` - functionality types
    - `utils.ts` - basic utility
    - `lifecycle.ts` - called when the extension is uninstalled

