import AstalMpris from "gi://AstalMpris";
import { createBinding, For } from "gnim";

export default function Media() {
    const mpris = AstalMpris.get_default();
    const players = createBinding(mpris, "players");
    return (<box>
        <For each={players}>
            {(player) => (
                <box>
                    <image pixelSize={20} file={createBinding(player, "coverArt")} />
                    <label label={createBinding(player, "title")} />
                    <label label="|" />
                    <label label={createBinding(player, "artist")} />
                </box>
            )}
        </For>
    </box>);
}
