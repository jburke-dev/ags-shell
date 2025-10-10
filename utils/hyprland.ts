import GObject, { register } from 'ags/gobject';
import AstalHyprland from 'gi://AstalHyprland';
import { Accessor, createBinding } from 'gnim';

@register({ GTypeName: 'HyprlandAdapter' })
export class HyprlandAdapter extends GObject.Object {
    readonly hyprland = AstalHyprland.get_default();
    readonly workspaces = createBinding(this.hyprland, 'workspaces');
    readonly monitors = createBinding(this.hyprland, 'monitors');
    readonly focusedWorkspace = createBinding(
        this.hyprland,
        'focusedWorkspace'
    );
    readonly activeWorkspaces = this.workspaces.as((workspaces) =>
        workspaces
            .filter((workspace) => !(workspace.id >= -99 && workspace.id <= -2))
            .sort((a, b) => a.id - b.id)
    );

    constructor() {
        super();
    }

    focusWorkspace(id: number): void {
        this.hyprland.dispatch('workspace', `${id}`);
    }
}

export const compositor = new HyprlandAdapter();
