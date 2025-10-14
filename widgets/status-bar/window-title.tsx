import { Accessor, createBinding, With } from 'ags';
import { compositor } from '../../utils/hyprland';

export default function WindowTitle() {
    return (
        <box class='WindowTitle'>
            <With value={compositor.focusedClient}>
                {(client) =>
                    client ? (
                        <label
                            label={createBinding(client, 'title').as(
                                (title) => title ?? ''
                            )}
                        />
                    ) : (
                        <label label='' />
                    )
                }
            </With>
        </box>
    );
}
