import { createBinding } from 'gnim';
import { picker } from '../../utils/picker';

export function SearchBar() {
    const searchText = createBinding(picker, 'searchText');
    return (
        <box class='search'>
            <entry
                $={(self) => (picker.searchEntry = self)}
                text={searchText}
                onNotifyText={(self) => picker.setSearchText(self.text)}
                hexpand
            />
        </box>
    );
}
