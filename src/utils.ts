import * as path from "path";
import { outputChannel, println } from "./outputChannel";
import { GenMsgBtn, GenMsgType } from "./types";

export const extensionPath = extensions.getExtension('nur.script')?.extensionPath || "";
export const getSetting = workspace.getConfiguration('script').get;

if (!extensionPath) {
    showErrMsg("Extension Path Not Found!")
}

export interface Deferred<T> extends Promise<T> {
    resolve(value?: T | PromiseLike<T>): void;
    reject(reason?: any): void;
}

export function deferred<T>() {
    let methods;
    const promise = new Promise((resolve, reject) => {
        methods = { resolve, reject };
    });
    return Object.assign(promise, methods) as Deferred<T>;
}

export function openTextFile(...filepath: string[]) {
    return workspace
        .openTextDocument(Uri.file(path.join(...filepath)))
        .then(window.showTextDocument, showErrMsg)
}

export function showErrMsg(error: any, lable = "Show", fn?: () => any) {
    println(error);
    return window.showErrorMessage(error?.message ?? error, lable)
        .then(clicked => clicked === lable && typeof fn == "function" ? fn() : outputChannel.show());
}

const _genMsg = (type: GenMsgType, msg = "", btns?: GenMsgBtn) => new Promise((resolve, reject) => {
    if (typeof btns === 'object' && btns !== null) {
        var defaultHandaler = (<any>btns)['_'];
        delete (<any>btns)['_'];
        var items = Object.keys(btns);
    }
    //@ts-ignore: items!: string[] | undefiend
    if (!items) window[type](msg).then(resolve, reject);
    else window[type](msg, ...items).then(async selectedItem => {
        try {
            const handaler = (<any>btns)[<any>selectedItem];
            if (typeof handaler == "function") var value = await handaler();
            else if (typeof defaultHandaler == "function") value = await defaultHandaler()
            resolve(value);
        } catch (error) {
            reject(error);
        }
    }, reject);
});

export const show = {
    errMsg: (msg: string, btn?: GenMsgBtn) => _genMsg("showErrorMessage", msg, btn),
    infoMsg: (msg: string, btn?: GenMsgBtn) => _genMsg("showInformationMessage", msg, btn),
    warnMsg: (msg: string, btn?: GenMsgBtn) => _genMsg("showWarningMessage", msg, btn),
}