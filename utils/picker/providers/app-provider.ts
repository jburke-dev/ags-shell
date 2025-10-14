import { register } from 'gnim/gobject';
import { BaseProvider } from '../provider';
import Apps from 'gi://AstalApps';
import { AppItem } from '../types';

@register({ GTypeName: 'AppProvider' })
export class AppProvider extends BaseProvider {
    static readonly COMMAND_NAME = 'app';
    private apps = new Apps.Apps();

    constructor() {
        super();
        this.command = AppProvider.COMMAND_NAME;
    }

    search(query: string): void {
        this.setLoading(true);
        try {
            const trimmedQuery = query.trim();

            if (trimmedQuery.length === 0) {
                this.setDefaultResults(this.apps.get_list());
            } else {
                const fuzzyResults = this.apps
                    .fuzzy_query(trimmedQuery)
                    .slice(0, 10); // TODO: pull out max results into config
                this.setResults(fuzzyResults);
            }
        } finally {
            this.setLoading(false);
        }
    }

    activate(item: AppItem): void {
        item.launch();
    }
}
