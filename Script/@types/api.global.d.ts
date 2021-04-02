export { }

declare global {
    interface PickerOption {
        fn(): void
        label: string
        busy?: boolean
        detail?: string
        priority?: number
        alwaysShow?: boolean
        description?: string
    }

    const Context: Promise<ExtensionContext>;
    namespace Script {
        /**
         * Listen onActivate.
         * You can also use it to get `ExtensionContext`
         */
        function onActivate(fn: (ctx: ExtensionContext) => any): Promise<any>
        /** This Event run when the Extention is deactivated */
        function onDeactivate(fn: () => void): void
        /** `show`, `hide` and `clear` ourput programmatically */
        function output(method: 'show' | 'hide' | 'clear'): void;

        /** @returns Cleanup function */
        function picker(label: string, fn: () => void, priority = 0): () => void;
        /** @returns Cleanup function */
        function picker(object: PickerOption): () => void;
        function picker(any: PickerOption | string, fn: () => void, priority = 0): () => void;
    }
    /** Print message to `output` */
    function print(msg?: any): void;
    /** Print to `Output` with newline. */
    function println(msg?: any): void;
}