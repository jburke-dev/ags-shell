import GObject, { property, register, signal } from 'gnim/gobject';
import { PickerItem } from './types';

export type SearchProvider = BaseProvider & ISearchProvider;

export interface ISearchProvider {
    readonly command: string;
    search(query: string): void;
    activate(item: PickerItem): void;
    dispose(): void;
}

@register({ GTypeName: 'BaseProvider' })
export class BaseProvider extends GObject.Object {
    @property(Array) results: PickerItem[] = [];
    @property(Array) defaultResults: PickerItem[] = [];
    @property(Boolean) isLoading = false;
    @property(String) command: string = '';
    @property(Boolean) showingDefaults = false;

    @signal([Array], GObject.TYPE_NONE, { default: false })
    resultsChanged(results: any[]): undefined {}

    @signal([Boolean], GObject.TYPE_NONE, { default: false })
    loadingChanged(isLoading: boolean): undefined {}

    constructor() {
        super();
    }

    setResults(results: PickerItem[]) {
        this.results = results;
        this.emit('results-changed', results);
    }

    setDefaultResults(allItems: PickerItem[]) {
        const maxResults = 10;
        const defaults = allItems.slice(0, maxResults);
        this.defaultResults = defaults;
        this.results = defaults;
        this.showingDefaults = true;
        this.emit('results-changed', defaults);
    }

    setLoading(loading: boolean) {
        if (this.isLoading !== loading) {
            this.isLoading = loading;
            this.emit('loading-changed', loading);
        }
    }
}
