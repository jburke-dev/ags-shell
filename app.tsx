import app from 'ags/gtk4/app';
import css from './styles/styles.scss';
import StatusBar from './windows/StatusBar';
import { createBinding, For } from 'gnim';
import { Gtk } from 'ags/gtk4';
import PickerWindow from './windows/Picker';

app.start({
    css,
    instanceName: 'ags-shell',
    requestHandler(argv: string[], res: (response: any) => void) {
        const request = argv[0];
        switch (request) {
            case 'picker':
                app.toggle_window('picker');
                res('picker toggled');
                break;
            default:
                res('not found');
        }
    },
    main() {
        const monitors = createBinding(app, 'monitors');
        PickerWindow();
        return (
            <For
                each={monitors}
                cleanup={(win) => (win as Gtk.Window).destroy()}
            >
                {(monitor) => <StatusBar gdkmonitor={monitor} />}
            </For>
        );
    },
});
