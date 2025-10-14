import { createBinding } from 'gnim';
import { picker } from '../../utils/picker';

export function SearchBar() {
    const searchText = createBinding(picker, 'searchText');
    const placeholderText = createBinding(picker, 'placeholderText');
    return (
        <box class='search'>
            <entry
                $={(self) => (picker.searchEntry = self)}
                text={searchText}
                placeholderText={placeholderText}
                onNotifyText={(self) => picker.setSearchText(self.text)}
                hexpand
                onActivate={() => picker.activateSelectedResult()}
            />
        </box>
    );
}
