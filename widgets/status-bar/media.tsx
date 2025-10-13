import AstalMpris from 'gi://AstalMpris';
import { createBinding, For, With } from 'gnim';
import { firstActivePlayer } from '../../utils/mpris';

export default function Media() {
    return (
        <box>
            <With value={firstActivePlayer}>
                {(player) =>
                    player ? (
                        <box>
                            <image
                                pixelSize={20}
                                file={createBinding(player, 'coverArt')}
                            />
                            <label label={createBinding(player, 'title')} />
                            <label label='|' />
                            <label label={createBinding(player, 'artist')} />
                        </box>
                    ) : (
                        ''
                    )
                }
            </With>
        </box>
    );
}
