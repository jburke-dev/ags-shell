import app from "ags/gtk4/app";
import StatusBar from "./windows/StatusBar";

app.start({
    main() {
        const monitors = app.get_monitors();
        monitors.map((monitor) => StatusBar({ gdkmonitor: monitor }));
    }
})
