import { Astal, Gdk, Gtk } from "ags/gtk4";
import Clock from "../widgets/clock";
import { onCleanup } from "ags";
import app from "ags/gtk4/app";
import Workspaces from "../widgets/workspaces";
import AstalHyprland from "gi://AstalHyprland";
import WindowTitle from "../widgets/window-title";

export default function StatusBar({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;
    const hypr = AstalHyprland.get_default();
    const monitor = hypr.get_monitor_by_name(gdkmonitor.connector)!;

    let win: Astal.Window;
    onCleanup(() => win!.destroy());
    return <window visible name={`statusbar-${gdkmonitor.connector}`} gdkmonitor={gdkmonitor} class="StatusBar" exclusivity={Astal.Exclusivity.EXCLUSIVE} anchor={TOP | LEFT | RIGHT} application={app}>
        <centerbox>
            <box $type="start">
                <Workspaces monitorId={monitor.id} />
            </box>
            <box $type="center">
                <WindowTitle monitorId={monitor.id} />
            </box>
            <box $type="end">
                <Clock />
            </box>
        </centerbox>
    </window>
}
