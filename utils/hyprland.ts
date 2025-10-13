import GObject, { register } from 'ags/gobject';
import app from 'ags/gtk4/app';
import AstalHyprland from 'gi://AstalHyprland';
import { Accessor, createBinding } from 'gnim';

@register({ GTypeName: 'HyprlandAdapter' })
export class HyprlandAdapter extends GObject.Object {
    readonly hyprland = AstalHyprland.get_default();
    readonly workspaces = createBinding(this.hyprland, 'workspaces');
    readonly monitors = createBinding(this.hyprland, 'monitors');
    readonly focusedMonitor = createBinding(this.hyprland, 'focusedMonitor');
    readonly focusedGdkMonitor = this.focusedMonitor((hyprMonitor) => {
        const monitors = app.get_monitors();
        return (
            monitors.find(
                (gdkMon) => gdkMon.get_connector() === hyprMonitor.name
            ) ?? monitors[0]
        );
    });
    readonly focusedWorkspace = createBinding(
        this.hyprland,
        'focusedWorkspace'
    );
    readonly activeWorkspaces = this.workspaces.as((workspaces) =>
        workspaces
            .filter((workspace) => !(workspace.id >= -99 && workspace.id <= -2))
            .sort((a, b) => a.id - b.id)
    );
    readonly focusedClient = createBinding(this.hyprland, 'focusedClient');

    constructor() {
        super();
    }

    focusWorkspace(id: number): void {
        this.hyprland.dispatch('workspace', `${id}`);
    }
}

export const compositor = new HyprlandAdapter();
