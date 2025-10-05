import { Astal, Gdk, Gtk } from "ags/gtk4";
import Clock from "../widgets/clock";
import { onCleanup } from "ags";
import app from "ags/gtk4/app";

export default function StatusBar({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

    let win: Astal.Window;
    onCleanup(() => win!.destroy());
    return <window visible name={`statusbar-${gdkmonitor.connector}`} gdkmonitor={gdkmonitor} class="StatusBar" exclusivity={Astal.Exclusivity.EXCLUSIVE} anchor={TOP | LEFT | RIGHT} application={app}>
        <centerbox>
            <box $type="start">
            </box>
            <box $type="center"></box>
            <box $type="end">
                <Clock />
            </box>
        </centerbox>
    </window>
}
