import * as util from "util";

// This Module Provide Output Utility.

export const outputChannel = window.createOutputChannel('Script');

globalThis.output = function (method, option = false) {
    if (method == 'show') outputChannel.show(option);
    else if (method == 'hide') outputChannel.hide();
    else if (method == 'clear') outputChannel.clear();
};

const inspector = (data: any) => typeof data == "boolean" ||
    typeof data == "string" ||
    typeof data == "number"
    ? String(data)
    : util.inspect(data);

export function println(data: any) {
    outputChannel.appendLine(inspector(data));
}
globalThis.print = data => outputChannel.append(inspector(data));
globalThis.println = println;