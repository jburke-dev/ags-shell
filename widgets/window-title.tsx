import { Accessor, createBinding, With } from 'ags';
import AstalHyprland from 'gi://AstalHyprland';

export default function WindowTitle() {
    const hypr = AstalHyprland.get_default();
    const activeClient = createBinding(hypr, 'focusedClient');

    return (
        <box class='WindowTitle'>
            {activeClient && (
                <With value={activeClient}>
                    {(client) => (
                        <label label={createBinding(client, 'title')} />
                    )}
                </With>
            )}
        </box>
    );
}
