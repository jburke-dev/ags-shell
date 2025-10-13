import { Astal, Gdk } from 'ags/gtk4';
import Clock from '../widgets/status-bar/clock';
import app from 'ags/gtk4/app';
import Workspaces from '../widgets/status-bar/workspaces';
import AstalHyprland from 'gi://AstalHyprland';
import WindowTitle from '../widgets/status-bar/window-title';
import Media from '../widgets/status-bar/media';

export default function StatusBar({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;
    const hypr = AstalHyprland.get_default();
    const monitor = hypr.get_monitor_by_name(gdkmonitor.connector)!;

    return (
        <window
            visible
            name={`statusbar-${gdkmonitor.connector}`}
            gdkmonitor={gdkmonitor}
            class='StatusBar'
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={TOP | LEFT | RIGHT}
            application={app}
        >
            <centerbox>
                <box $type='start'>
                    <Workspaces monitorId={monitor.id} />
                </box>
                <box $type='center'>
                    <WindowTitle />
                </box>
                <box $type='end'>
                    <Media />
                    <Clock />
                </box>
            </centerbox>
        </window>
    );
}
