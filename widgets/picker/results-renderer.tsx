import { Gtk } from 'ags/gtk4';
import { createBinding, createComputed, For, With } from 'gnim';
import { picker } from '../../utils/picker';
import { ItemButton } from './item-button';

enum SearchStates {
    Empty,
    Loading,
    HasResults,
    NotFound,
}

function NotFound() {
    return (
        <box halign={Gtk.Align.CENTER} orientation={Gtk.Orientation.VERTICAL}>
            <label label={`No results found`} />
        </box>
    );
}

function Empty() {
    return (
        <box halign={Gtk.Align.CENTER} orientation={Gtk.Orientation.VERTICAL}>
            <label label={`Search & select to populate results`} />
        </box>
    );
}

function Loading() {
    return (
        <box halign={Gtk.Align.CENTER} orientation={Gtk.Orientation.VERTICAL}>
            <label label='Loading...' />
        </box>
    );
}

function ResultsContainer() {
    const currentResults = createBinding(picker, 'currentResults');
    return (
        <box class='results-list' orientation={Gtk.Orientation.VERTICAL}>
            <For each={currentResults}>
                {(item, index) => <ItemButton item={item} index={index} />}
            </For>
        </box>
    );
}

export function ResultsRenderer() {
    const _hasQuery = createBinding(picker, 'hasQuery');
    const _searchText = createBinding(picker, 'searchText');
    const _hasResults = createBinding(picker, 'hasResults');
    const _isLoading = createBinding(picker, 'isLoading');
    const viewState = createComputed(
        [_hasQuery, _searchText, _hasResults, _isLoading],
        (hasQuery, searchText, hasResults, isLoading) => {
            if (!hasQuery && !hasResults) return SearchStates.Empty;
            if (isLoading) return SearchStates.Loading;
            if (hasResults) return SearchStates.HasResults;

            return SearchStates.NotFound;
        }
    );
    return (
        <box orientation={Gtk.Orientation.VERTICAL}>
            <box
                class='results-container'
                orientation={Gtk.Orientation.VERTICAL}
            >
                <With value={viewState}>
                    {(state) => {
                        switch (state) {
                            case SearchStates.Loading:
                                return <Loading />;
                            case SearchStates.HasResults:
                                return <ResultsContainer />;
                            case SearchStates.Empty:
                                return <Empty />;
                            case SearchStates.NotFound:
                                return <NotFound />;
                        }
                    }}
                </With>
            </box>
        </box>
    );
}
