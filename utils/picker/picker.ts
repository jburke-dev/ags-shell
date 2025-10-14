import { Gdk, Gtk } from 'ags/gtk4';
import GObject, { property, register, signal } from 'gnim/gobject';
import { SearchProvider } from './provider';
import { BaseItem } from './types';
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
    @property(Array) currentResults: BaseItem[] = [];
    @property(Boolean) hasResults = false;

    private providers = new Map<string, SearchProvider>();
    private providerSignalIds = new Map<string, number[]>();

    @signal([String], GObject.TYPE_NONE, { default: false })
    providerChanged(provider: string): undefined {}

    @signal([Array], GObject.TYPE_NONE, { default: false })
    resultsChanged(results: BaseItem[]): undefined {}

    set window(window: Gtk.Window | null) {
        this.windowRef = window;
    }

    set searchEntry(entry: Gtk.Entry | null) {
        this.searchEntryRef = entry;
    }

    get currentProvider(): SearchProvider | undefined {
        return this.providers.get(this.activeProvider);
    }

    constructor() {
        super();
    }

    addProvider(provider: SearchProvider): void {
        this.providers.set(provider.command, provider);
        const signalIds: number[] = [];

        signalIds.push(
            provider.connect(
                'results-changed',
                (provider: SearchProvider, results: BaseItem[]) => {
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
            // TODO: reset selection
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
            case Gdk.KEY_Escape:
                this.hide();
                return true;
        }
        return false;
    }

    activateSelectedResult() {}
}

export const picker = Picker.getInstance();
