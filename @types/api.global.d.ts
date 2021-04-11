import vscode from "vscode";

declare global {
    interface PickerItem {
        fn(): any
        label: string
        busy?: boolean
        hide?: boolean
        detail?: string
        priority?: number
        alwaysShow?: boolean
        description?: string
    }
    interface PickerItemRef extends PickerItem {
        dispose(): void
    }

    interface Picker {
        (label: string, fn: () => void, priority?: number): PickerItemRef;
        (object: PickerItem): PickerItemRef;
    }
    /** `show`, `hide` and `clear` ourput programmatically */
    function output(method: 'show' | 'hide' | 'clear'): void;
    /** Print message to `output` */
    function print(msg?: any): void;
    /** Print to `Output` with newline. */
    function println(msg?: any): void;
    /**
     * @example
     * ```js
     * const ref = picker({
     *     label: "Click Me!",
     *     fn() {
     *          show.infoMsg("clicked!");
     *          ref.dispose();
     *     }
     * });
     *
     * const ref2 = picker("Click Me, Also!", () => {
     *     show.infoMsg("¯\\_(ツ)_/¯");
     *     ref2.dispose();
     * });
     * ```
     */
    var picker: Picker

    function openTextFile(...filepath: string[]): vscode.Thenable<vscode.TextEditor>
    function showErrMsg(error: any, lable?: string, fn?: () => any): Thenable<false | void>
    // function useVScodeAPIGlobally(): void;

    interface Show {
        errMsg: (msg: string, btn?: Record<string, () => any>) => Promise<any>;
        infoMsg: (msg: string, btn?: Record<string, () => any>) => Promise<any>;
        warnMsg: (msg: string, btn?: Record<string, () => any>) => Promise<any>;
    }
    /**
     * @example
     * ```js
     * show.infoMsg("What's your favorite emoji?", {
     *     ['👻']() { println('Nice!') },
     *     ['💩']() { println('🤢') },
     *     none() { println('Ok!') },
     *     _() { println('Bye!') }
     * });
     * ```
     */
    var show: Show;
}