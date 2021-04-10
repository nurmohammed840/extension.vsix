// import { Script } from "./types";
// import { picker, quickPicker } from "./quickPicker";
import { createBoilerPlate } from "./example";
import * as menager from "./menager";
import { quickPicker } from "./quickPicker";

let pickerItems_exclude: PickerItem[] = [];

const Create_Script = picker("Create Script", () => {
    quickPicker.items = pickerItems_exclude;
    quickPicker.show();
});

Create_Script.hide = true;

menager.onChange(() => {
    const results = menager.getByType();

    if (results.exclude.length) {
        Create_Script.hide = false;
        pickerItems_exclude = results.exclude.map(script => ({
            label: script.name,
            detail: script.filepath,
            fn() {
                menager.ignore(script)
                return createBoilerPlate(script.filepath);
            }
        }));
    }
    else Create_Script.hide = true;




    // pickerItems_exclude.push({
    //     label: script.name,
    //     detail: script.filepath,
    //     fn() {
    //         // ignoredScripts.push(script);
    //         // excludeScripts.splice(excludeScripts.indexOf(script), 1);
    //         // if (!excludeScripts.length) Create_Script.dispose();
    //     }
    // });
});