import { Astal, Gdk, Gtk } from 'ags/gtk4';
import app from 'ags/gtk4/app';
import { compositor } from '../utils/hyprland';
import { picker } from '../utils/picker';
import { SearchBar } from '../widgets/picker/search-bar';

function PickerLayout({
    children,
}: {
    children: JSX.Element | Array<JSX.Element>;
}) {
    return (
        <box>
            <box
                hexpand={false}
                orientation={Gtk.Orientation.VERTICAL}
                valign={Gtk.Align.CENTER}
            >
                {children}
            </box>
        </box>
    );
}

export default function PickerWindow() {
    return (
        <window
            name='picker'
            gdkmonitor={compositor.focusedGdkMonitor}
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
                    // TODO: picker.handleKeyPress
                }}
            />
            <PickerLayout>
                <SearchBar />
            </PickerLayout>
        </window>
    );
}
