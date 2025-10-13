import { Accessor, createComputed, For } from 'ags';
import { compositor } from '../utils/hyprland';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';

const monitorIndexMap = compositor.monitors.as(
    (monitors) => new Map(monitors.map((m, index) => [m.name, index]))
);

interface WorkspaceButtonData {
    id: number;
    visible: boolean;
    monitorIndex?: number;
    workspace?: AstalHyprland.Workspace;
    monitorFocused: boolean;
}

function WorkspaceButtons({
    buttons,
}: {
    buttons: Accessor<WorkspaceButtonData[]>;
}) {
    return (
        <box class='Workspaces'>
            <For each={buttons}>
                {(buttonData) => (
                    <button
                        visible={buttonData.visible}
                        cssClasses={compositor.focusedWorkspace(
                            (focusedWorkspace) => {
                                const classes: string[] = [];
                                if (
                                    focusedWorkspace?.id ===
                                        buttonData.workspace?.id &&
                                    buttonData.workspace?.monitor.id ===
                                        focusedWorkspace?.monitor.id
                                ) {
                                    classes.push('focused');
                                }
                                if (
                                    buttonData.workspace?.get_clients().length
                                ) {
                                    classes.push('occupied');
                                }
                                if (!buttonData.monitorFocused) {
                                    classes.push('monitorInactive');
                                }
                                return classes;
                            }
                        )}
                        onClicked={() => {
                            compositor.focusWorkspace(buttonData.id);
                        }}
                    >
                        {buttonData.id}
                    </button>
                )}
            </For>
        </box>
    );
}

export default function Workspaces() {
    const workspaceButtons = createComputed(
        [
            compositor.activeWorkspaces,
            monitorIndexMap,
            compositor.focusedMonitor,
        ],
        (activeWorkspaces, monMap, focusedMonitor) => {
            const maxId = activeWorkspaces.length
                ? activeWorkspaces[activeWorkspaces.length - 1].id
                : 1;
            const maxWorkspaces = 10;

            const workspaceData: WorkspaceButtonData[] = Array.from(
                { length: maxWorkspaces },
                (_, i): WorkspaceButtonData => {
                    const id = i + 1;
                    const workspace = activeWorkspaces.find((w) => w.id === id);
                    return {
                        id,
                        visible: maxId >= id,
                        workspace,
                        monitorIndex: monMap.get(
                            workspace?.monitor.get_name() ?? ''
                        ),
                        monitorFocused:
                            workspace?.monitor.get_name() ==
                            focusedMonitor.get_name(),
                    };
                }
            );
            return workspaceData;
        }
    );

    // Cleanup handler on destroy
    return (
        <box>
            <WorkspaceButtons buttons={workspaceButtons} />
        </box>
    );
}
