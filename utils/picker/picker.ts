import { Gdk, Gtk } from 'ags/gtk4';
import GObject, { property, register, signal } from 'gnim/gobject';
import { SearchProvider } from './provider';
import { PickerItem } from './types';
import { AppProvider } from './providers/app-provider';

@register({ GTypeName: 'Picker' })
export class Picker extends GObject.Object {
    private static instance: Picker | null = null;

    private windowRef: Gtk.Window | null = null;
    private searchEntryRef: Gtk.Entry | null = null;

    @property(Boolean) isVisible = false;
    @property(Boolean) isLoading = false;
    @property(String) searchText = '';
    @property(String) placeholderText = 'Search...';
    @property(Boolean) hasQuery = false;
    @property(String) activeProvider = AppProvider.COMMAND_NAME;
    @property(Array) currentResults: PickerItem[] = [];
    @property(Boolean) hasResults = false;
    @property(Number) selectedIndex = 0;
    @property(Boolean) hasNavigated = false;

    private providers = new Map<string, SearchProvider>();
    private providerSignalIds = new Map<string, number[]>();

    @signal([String], GObject.TYPE_NONE, { default: false })
    providerChanged(provider: string): undefined {}

    @signal([Array], GObject.TYPE_NONE, { default: false })
    resultsChanged(results: PickerItem[]): undefined {}

    set window(window: Gtk.Window | null) {
        this.windowRef = window;
    }

    set searchEntry(entry: Gtk.Entry | null) {
        this.searchEntryRef = entry;
    }

    get currentProvider(): SearchProvider | undefined {
        return this.providers.get(this.activeProvider);
    }

    get selectedResult(): PickerItem | null {
        return this.currentResults[this.selectedIndex] || null;
    }

    constructor() {
        super();
    }

    private resetSelection() {
        this.selectedIndex = 0;
        this.hasNavigated = false;
    }

    private moveSelection(direction: 1 | -1): boolean {
        if (this.currentResults.length === 0) return false;
        if (!this.hasNavigated) {
            this.hasNavigated = true;
            return true;
        }
        const newIndex = this.selectedIndex + direction;

        if (newIndex < 0) {
            this.selectedIndex = this.currentResults.length - 1;
        } else if (newIndex >= this.currentResults.length) {
            this.selectedIndex = 0;
        } else {
            this.selectedIndex = newIndex;
        }
        return true;
    }

    addProvider(provider: SearchProvider): void {
        this.providers.set(provider.command, provider);
        const signalIds: number[] = [];

        signalIds.push(
            provider.connect(
                'results-changed',
                (provider: SearchProvider, results: PickerItem[]) => {
                    if (provider.command === this.activeProvider) {
                        this.currentResults = results;
                        this.hasResults = results.length > 0;
                        this.emit('results-changed', results);
                    }
                }
            )
        );

        signalIds.push(
            provider.connect(
                'loading-changed',
                (provider: SearchProvider, loading: boolean) => {
                    if (provider.command === this.activeProvider) {
                        this.isLoading = loading;
                    }
                }
            )
        );
        this.providerSignalIds.set(provider.command, signalIds);
        if (provider.command === this.activeProvider) {
            setTimeout(() => {
                provider.search('');
            }, 0);
        }
    }

    setSearchText(text: string): void {
        if (this.searchText !== text) {
            this.searchText = text;
            this.hasQuery = text.trim().length > 0;
            this.resetSelection();
            this.currentProvider?.search(this.searchText);
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

    clearSearch() {
        this.searchText = '';
        this.hasQuery = false;

        if (this.currentProvider) {
            this.currentProvider.search('');
        }
    }

    dispose(): void {
        for (const [command, signalIds] of this.providerSignalIds) {
            const provider = this.providers.get(command);
            signalIds.forEach((id) => provider?.disconnect(id));
        }
        this.providerSignalIds.clear();
        for (const provider of this.providers.values()) {
            provider?.dispose?.();
        }
        this.providers.clear();
        if (Picker.instance === this) {
            Picker.instance = null;
        }
    }

    handleKeyPress({
        key,
        controlMod,
    }: {
        key: number;
        controlMod?: boolean;
    }): boolean {
        switch (key) {
            case Gdk.KEY_KP_Enter:
                const selected = this.selectedResult;
                if (selected) {
                    this.activate(selected);
                    return true;
                }
                return false;
            case Gdk.KEY_Escape:
                this.hide();
                return true;
            case Gdk.KEY_N:
            case Gdk.KEY_n:
                if (controlMod) {
                    return this.moveSelection(1);
                }
                return false;
            case Gdk.KEY_P:
            case Gdk.KEY_p:
                if (controlMod) {
                    return this.moveSelection(-1);
                }
                return false;
            case Gdk.KEY_Down:
                return this.moveSelection(1);
            case Gdk.KEY_Up:
                return this.moveSelection(-1);
        }
        return false;
    }

    activate(item: PickerItem): void {
        const provider = this.currentProvider;
        provider?.activate(item);
        this.hide();
    }

    activateSelectedResult() {}
}

export const picker = Picker.getInstance();
