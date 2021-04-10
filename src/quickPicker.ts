import { outputChannel } from "./outputChannel";
import { PickerItem } from "./types";
import { extensionPath, openTextFile, showErrMsg } from "./utils";

// This Module Provide Picker Utility.

export const quickPicker = window.createQuickPick();

quickPicker.matchOnDescription = true;

// Costom Picker Items
const pickerItems: PickerItem[] = [
    { label: 'Show Output', priority: 0, fn() { outputChannel.show(true); }, },
    { label: 'Clear Output', priority: 0, fn() { outputChannel.clear(); }, },
    { label: 'Open Config File', priority: 0, fn() { openTextFile(extensionPath, 'package.json'); }, },
];

/**  Reset to `null` everytime, When `showPicker()` called. */
let busyState: PickerItem | null = null;
export function showPicker() {
    busyState = null
    // @ts-ignore: `priority` isn't possibly 'undefined'
    quickPicker.items = pickerItems.filter(x => !x.hide).sort((a, b) => a.priority > b.priority ? -1 : 1);
    quickPicker.busy = false;
    quickPicker.show();
}

quickPicker.onDidAccept(async () => {
    const selected = quickPicker.activeItems[0] as PickerItem;
    try {
        // @ts-ignore: `priority` isn't possibly 'undefined'
        selected.priority++;
        quickPicker.placeholder = selected.label;

        if (selected.busy) {
            busyState = selected;
            quickPicker.busy = true;
        }
        else if (!quickPicker.busy) quickPicker.hide();

        await selected.fn();
    } catch (err) {
        showErrMsg(err);
    } finally {
        // We are waiting for `selected.fn()` to finished, then hide `quickPicker`.
        // But only if `busyState === selected`, Becouse in this meantime, Another picker action can occur,
        if (busyState === selected) quickPicker.hide();
        // If we don't do this checking then, It would be like:
        // Lets say picker `action1` need 3s to complect, then it hide, 
        // In this meantime, picker `action2` occurs,
        // But Then `action1` completed and hide. As a result `quickPicker` did hide without receiving action from `action2`.
    }
});

function picker(label: string, fn: () => any, priority?: number): PickerItemRef;
function picker(object: PickerItem): PickerItemRef;
function picker(any: string | PickerItem, fn?: () => any, priority?: number) {
    // We are chacking strictly Because, User may use javascipt,
    let item = {} as PickerItemRef;
    if (typeof any == 'string' && typeof fn == 'function') {
        item.fn = fn;
        item.label = any;
        item.priority = typeof priority == "number" ? priority : 0;
        pickerItems.push(item);
    }
    else if (typeof any == 'object' && typeof any.label == 'string' && typeof any.fn == 'function') {
        item = any as PickerItemRef;
        any.priority = typeof any.priority == "number" ? any.priority : 0;
        pickerItems.push(any);
    }
    item.dispose = () => {
        const index = pickerItems.indexOf(item);
        index == -1 && pickerItems.splice(index, 1);
    };
    return item
}

picker.show = showPicker;
picker.hide = () => quickPicker.hide();
picker.onDidHide = quickPicker.onDidHide.bind(quickPicker);
picker.onDidAccept = quickPicker.onDidAccept.bind(quickPicker);
picker.onDidChangeValue = quickPicker.onDidChangeValue.bind(quickPicker);
picker.value = (v: string) => v === undefined ? quickPicker.value : quickPicker.value = v;

export { picker };