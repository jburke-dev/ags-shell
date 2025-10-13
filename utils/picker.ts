import { Gtk } from 'ags/gtk4';
import GObject, { property, register } from 'gnim/gobject';

@register({ GTypeName: 'Picker' })
export class Picker extends GObject.Object {
    private static instance: Picker | null = null;

    private windowRef: Gtk.Window | null = null;
    private searchEntryRef: Gtk.Entry | null = null;

    @property(Boolean) isVisible = false;
    @property(String) searchText = '';

    constructor() {
        super();
    }

    set window(window: Gtk.Window | null) {
        this.windowRef = window;
    }

    set searchEntry(entry: Gtk.Entry | null) {
        this.searchEntryRef = entry;
    }

    setSearchText(text: string): void {
        if (this.searchText !== text) {
            this.searchText = text;
            // TODO: reset selection
        }
    }

    public static getInstance(): Picker {
        if (!Picker.instance) {
            Picker.instance = new Picker();
        }
        return Picker.instance;
    }

    show(): void {
        if (this.windowRef) {
            this.isVisible = true;
            this.windowRef.show();
            this.focusSearch();
        }
    }

    hide(): void {
        if (this.windowRef) {
            this.isVisible = false;
            this.windowRef.hide();
        }
    }

    focusSearch() {
        this.searchEntryRef?.grab_focus();
    }

    dispose(): void {
        if (Picker.instance === this) {
            Picker.instance = null;
        }
    }
}

export const picker = Picker.getInstance();
