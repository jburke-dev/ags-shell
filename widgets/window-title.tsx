import { Accessor, createBinding, createComputed, createState, With } from "ags";
import AstalHyprland from "gi://AstalHyprland";

export default function WindowTitle({ monitorId }: { monitorId: number }) {
    const hypr = AstalHyprland.get_default();
    const [lastTitle, setLastTitle] = createState('');
    const activeClient = createBinding(hypr, "focusedClient");
    const title = createComputed([lastTitle, activeClient], (lastTitle, activeClient) => {
        if (!activeClient || activeClient.monitor.id != monitorId) {
            return lastTitle;
        }
        setLastTitle(activeClient.title);
        return activeClient.title;
    });

    return (
        <box class="WindowTitle">
            {
                /*
                <With value={createBinding(hypr, "focusedClient")}>
                    {(client: AstalHyprland.Client | null) => {
                        if (!client) {
                            return (<label label="" />);
                        } else {
                            // TODO: nesting fragments aren't yet supported :/
                             return (<With value={createBinding(client, "title")}>
                                {(title: string) => (<label label={title} />)}
                            </With>);
                            return (<label label={client.title} />);
                        }
                    }}
                </With>
                */
            }
            <label label={title} />
        </box>
    );
}
