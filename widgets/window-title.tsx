import { Accessor, createBinding, With } from 'ags';
import AstalHyprland from 'gi://AstalHyprland';

export default function WindowTitle() {
    const hypr = AstalHyprland.get_default();
    const activeClient = createBinding(hypr, 'focusedClient');

    return (
        <box class='WindowTitle'>
            <With value={activeClient}>
                {(client) =>
                    client ? (
                        <label label={createBinding(client, 'title')} />
                    ) : (
                        <label label='' />
                    )
                }
            </With>
        </box>
    );
}
