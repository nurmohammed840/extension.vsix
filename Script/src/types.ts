// Type Information

export interface PickerItem {
    fn(): any
    label: string
    busy?: boolean
    hide?: boolean
    detail?: string
    priority?: number
    alwaysShow?: boolean
    description?: string
}
export interface PickerItemRef extends PickerItem {
    dispose(): void
}

export enum RegistryState {
    allowed, 
    exclude,
    // Todo: Provide implement `ignored` state,
    // ignored, 
    // panding, 
}

export type Registry = Record<string, { name: string, state: RegistryState }>;

export interface Script {
    name: string;
    filepath: string;
}

export type GenMsgType = 'showErrorMessage' | 'showInformationMessage' | 'showWarningMessage';
export type GenMsgBtn = Record<string, () => any>;