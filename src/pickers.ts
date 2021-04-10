// import { Script } from "./types";
import { picker, quickPicker } from "./quickPicker";
import * as menager from "./menager";

const pickerItems_exclude: PickerItem[] = [];

const Create_Script = picker("Create Script", () => {
    quickPicker.items = pickerItems_exclude;
    quickPicker.show();
});

menager.onExclude(script => {
    Create_Script.hide = false;
    pickerItems_exclude.push({
        label: script.name,
        detail: script.filepath,
        fn() {
            // ignoredScripts.push(script);
            // excludeScripts.splice(excludeScripts.indexOf(script), 1);
            // if (!excludeScripts.length) Create_Script.dispose();
            // return createBoilerPlate(script);
        }
    });
});