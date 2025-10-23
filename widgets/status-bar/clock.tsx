import { Gtk } from 'ags/gtk4';
import { createPoll } from 'ags/time';
import GLib from 'gi://GLib?version=2.0';
import { createState } from 'gnim';

export default function Clock() {
    const time = createPoll(new GLib.DateTime(), 1000, () => {
        return GLib.DateTime.new_now_local();
    });
    const [isHovered, setHovered] = createState(false);
    const baseTime = time((t) => `\uf017 ${t.format('%H:%M') ?? ''}`);
    const extendedTime = time(
        (t) => `- \uef37 ${t.format('%a %b %e, %Y') ?? ''}`
    );

    return (
        <menubutton>
            <Gtk.EventControllerMotion
                propagationPhase={Gtk.PropagationPhase.BUBBLE}
                onEnter={() => setHovered(true)}
                onLeave={() => setHovered(false)}
            />
            <box>
                <label label={baseTime} />
                <revealer
                    revealChild={isHovered}
                    transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
                    transitionDuration={200}
                >
                    <label label={extendedTime} />
                </revealer>
            </box>
            <popover>
                <Gtk.Calendar />
            </popover>
        </menubutton>
    );
}
