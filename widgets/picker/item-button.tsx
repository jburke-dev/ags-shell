import { Gtk } from 'ags/gtk4';
import { PickerItem } from '../../utils/picker/types';
import { Accessor, createBinding, createComputed } from 'gnim';
import { picker } from '../../utils/picker';

export function ItemButton({
    item,
    index,
}: {
    item: PickerItem;
    index: Accessor<number>;
}) {
    const selectedIndex = createBinding(picker, 'selectedIndex');
    const hasNavigated = createBinding(picker, 'hasNavigated');
    return (
        <box>
            <button
                hexpand
                onClicked={() => picker.activate(item)}
                cssClasses={createComputed(
                    [selectedIndex, hasNavigated, index],
                    (s, n, i) =>
                        s === i && n
                            ? ['app-button', 'selected']
                            : ['app-button']
                )}
            >
                <box spacing={4}>
                    {item.iconName && <image iconName={item.iconName} />}
                    <box
                        valign={Gtk.Align.CENTER}
                        orientation={Gtk.Orientation.VERTICAL}
                    >
                        <label
                            class='name'
                            halign={Gtk.Align.START}
                            label={item.name}
                        />
                        {item.description && (
                            <label
                                class='description'
                                wrap
                                halign={Gtk.Align.START}
                                label={item.description}
                            />
                        )}
                    </box>
                </box>
            </button>
        </box>
    );
}
