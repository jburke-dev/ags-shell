export interface BaseItem {
    // id: string;
    name: string;
    description?: string;
    iconName?: string;
    path?: string;
}

export interface AppItem extends BaseItem {
    launch(): void;
}

export type PickerItem = AppItem;
