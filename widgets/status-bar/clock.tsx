import { Gtk } from 'ags/gtk4';
import { createPoll } from 'ags/time';
import GLib from 'gi://GLib?version=2.0';

export default function Clock({ format = '%H:%M - %a %b %e, %Y' }) {
    const time = createPoll('', 1000, () => {
        return GLib.DateTime.new_now_local().format(format)!;
    }).as((t) => `\uf017 ${t}`);
    return (
        <menubutton>
            <label label={time} />
            <popover>
                <Gtk.Calendar />
            </popover>
        </menubutton>
    );
}
