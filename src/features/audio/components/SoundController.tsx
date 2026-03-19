import { useEffect } from 'react';
import { useSound } from 'use-sound';
import { useGameStore } from '@/app/store/useGameStore';
import { Volume2, VolumeX } from 'lucide-react';

const AmbiencePlayer = ({ src, volume, enabled }: { src: string, volume: number, enabled: boolean }) => {
    const [play, { stop, sound }] = useSound(src, {
        loop: true,
        volume: volume * 0.3,
        onload: () => {
            if (enabled) {
                // Fade in
                sound?.fade(0, volume * 0.3, 1000);
                play();
            }
        }
    });

    useEffect(() => {
        if (enabled) {
            play();
            sound?.fade(0, volume * 0.3, 1000);
        } else {
            // Fade out then stop
            if (sound) {
                sound.fade(sound.volume(), 0, 1000);
                setTimeout(() => stop(), 1000);
            } else {
                stop();
            }
        }
        return () => {
            stop();
        };
    }, [enabled, play, stop, sound, volume]);

    return null;
};

export const SoundController = () => {
    const { soundEnabled, toggleSound, volume, mixerChannels } = useGameStore();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {mixerChannels.map(channel => (
                <AmbiencePlayer
                    key={channel.id}
                    src={channel.src}
                    volume={channel.volume * volume} // Channel volume * Master volume
                    enabled={soundEnabled && !channel.muted && channel.volume > 0}
                />
            ))}

            <button
                onClick={toggleSound}
                className="p-3 rounded-full bg-surface border border-border text-superia shadow-lg hover:bg-surface-light transition-colors"
                title={soundEnabled ? "Mute All" : "Enable Sound"}
            >
                {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
        </div>
    );
};
