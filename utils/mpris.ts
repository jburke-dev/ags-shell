import AstalMpris from 'gi://AstalMpris';
import { createExternal } from 'gnim';

const mpris = AstalMpris.get_default();

export const activePlayers = createExternal(mpris.get_players(), (set) => {
    const interval = setInterval(() => {
        set(mpris.get_players());
    }, 1000);

    return () => {
        clearInterval(interval);
    };
});

export function filterActivePlayers(players: AstalMpris.Player[]) {
    return players.filter((player: AstalMpris.Player) => {
        if (!player.title && !player.artist) {
            return false;
        }

        if (player.playback_status) {
            return [
                AstalMpris.PlaybackStatus.PLAYING,
                AstalMpris.PlaybackStatus.PAUSED,
            ].includes(player.playback_status);
        }

        return true;
    });
}

export const firstActivePlayer = activePlayers((players) => {
    const active = filterActivePlayers(players);
    return active.length > 0 ? active[0] : null;
});
