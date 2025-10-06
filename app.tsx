import app from 'ags/gtk4/app';
import styles from './styles.scss';
import StatusBar from './windows/StatusBar';

app.start({
    css: styles,
    instanceName: 'ags-shell',
    main() {
        const monitors = app.get_monitors();
        monitors.map((monitor) => StatusBar({ gdkmonitor: monitor }));
    },
});
