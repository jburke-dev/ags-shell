import { Astal, Gdk, Gtk } from 'ags/gtk4';
import app from 'ags/gtk4/app';
import { compositor } from '../utils/hyprland';
import { picker } from '../utils/picker';
import { SearchBar } from '../widgets/picker/search-bar';
import { createBinding } from 'gnim';
import { ResultsRenderer } from '../widgets/picker/results-renderer';

function PickerLayout({
    children,
    onClickOutside,
}: {
    children: JSX.Element | Array<JSX.Element>;
    onClickOutside: () => void;
}) {
    return (
        <box>
            <button
                widthRequest={compositor.currentMonitorWidth((w) => w / 2)}
                onClicked={onClickOutside}
                class='invisible'
            />
            <box orientation={Gtk.Orientation.VERTICAL} vexpand>
                <button onClicked={onClickOutside} vexpand class='invisible' />
                <box
                    widthRequest={600}
                    class='picker'
                    orientation={Gtk.Orientation.VERTICAL}
                >
                    {children}
                </box>
                <button onClicked={onClickOutside} vexpand class='invisible' />
            </box>
            <button
                widthRequest={compositor.currentMonitorWidth((w) => w / 2)}
                onClicked={onClickOutside}
            />
        </box>
    );
}

export default function PickerWindow() {
    return (
        <window
            name='picker'
            gdkmonitor={compositor.focusedGdkMonitor}
            visible={createBinding(picker, 'isVisible')}
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
            exclusivity={Astal.Exclusivity.IGNORE}
            keymode={Astal.Keymode.ON_DEMAND}
            application={app}
            $={(self) => {
                picker.window = self;
            }}
            onNotifyVisible={({ visible }) => {
                if (visible) {
                    picker.focusSearch();
                }
            }}
        >
            <Gtk.EventControllerKey
                propagationPhase={Gtk.PropagationPhase.BUBBLE}
                onKeyPressed={(_controller, keyval, _keycode, state) => {
                    const controlMod =
                        (state & Gdk.ModifierType.CONTROL_MASK) !== 0;
                    picker.handleKeyPress({ key: keyval, controlMod });
                }}
            />
            <PickerLayout onClickOutside={() => picker.hide()}>
                <SearchBar />
                <ResultsRenderer />
            </PickerLayout>
        </window>
    );
}
