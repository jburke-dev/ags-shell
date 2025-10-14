import GObject, { property, register, signal } from 'gnim/gobject';
import { BaseItem } from './types';

export type SearchProvider = BaseProvider & ISearchProvider;

export interface ISearchProvider {
    readonly command: string;
    search(query: string): void;
    dispose(): void;
}

@register({ GTypeName: 'BaseProvider' })
export class BaseProvider extends GObject.Object {
    @property(Array) results: BaseItem[] = [];
    @property(Array) defaultResults: BaseItem[] = [];
    @property(Boolean) isLoading = false;
    @property(String) command: string = '';

    @signal([Array], GObject.TYPE_NONE, { default: false })
    resultsChanged(results: any[]): undefined {}

    @signal([Boolean], GObject.TYPE_NONE, { default: false })
    loadingChanged(isLoading: boolean): undefined {}

    constructor() {
        super();
    }

    setResults(results: BaseItem[]) {
        this.results = results;
        this.emit('results-changed', results);
    }

    setLoading(loading: boolean) {
        if (this.isLoading !== loading) {
            this.isLoading = loading;
            this.emit('loading-changed', loading);
        }
    }
}
