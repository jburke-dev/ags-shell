import { Gtk } from 'ags/gtk4';
import { BaseItem } from '../../utils/picker/types';
import { Accessor } from 'gnim';

export function ItemButton({
    item,
    index,
}: {
    item: BaseItem;
    index: Accessor<number>;
}) {
    return (
        <box>
            <button hexpand>
                <box spacing={4}>
                    <box
                        valign={Gtk.Align.CENTER}
                        orientation={Gtk.Orientation.VERTICAL}
                    >
                        <label
                            class='name'
                            halign={Gtk.Align.START}
                            label={item.name}
                        />
                    </box>
                </box>
            </button>
        </box>
    );
}
