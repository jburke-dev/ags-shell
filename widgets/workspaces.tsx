import { createBinding, For } from "ags";
import AstalHyprland from "gi://AstalHyprland";

export default function Workspaces({ monitorId }: { monitorId: number }) {
    const hypr = AstalHyprland.get_default();
    const workspaces = createBinding(hypr, "workspaces").as((workspaces) => {
        return workspaces.filter((ws) => !(ws.id >= -99 && ws.id <= -2) && ws.monitor.id == monitorId).sort((a, b) => a.id - b.id);
    });
    return (<box class="Workspaces opaque">
        <For each={workspaces}>
            {(workspace) => (<button class={createBinding(hypr, "focusedWorkspace").as((focusedWorkspace) => workspace == focusedWorkspace ? "focused" : "")} onClicked={() => workspace.focus()}>
                {workspace.id}
            </button>)}
        </For>
    </box>);
}
