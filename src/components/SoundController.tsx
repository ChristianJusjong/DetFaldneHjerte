import { useEffect } from 'react';
import useSound from 'use-sound';
import { useGameStore } from '../store/useGameStore';
import { Volume2, VolumeX } from 'lucide-react';

export const SoundController = () => {
    const { soundEnabled, toggleSound, volume } = useGameStore();

    const [playAmbience, { stop }] = useSound('/assets/audio/dungeon-ambience.mp3', {
        loop: true,
        volume: volume * 0.3, // Subtle background
    });

    useEffect(() => {
        if (soundEnabled) {
            playAmbience();
        } else {
            stop();
        }
        return () => stop();
    }, [soundEnabled, playAmbience, stop]);

    return (
        <button
            onClick={toggleSound}
            className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-surface border border-border text-superia shadow-lg hover:bg-surface-light transition-colors"
            title={soundEnabled ? "Mute Ambience" : "Enable Ambience"}
        >
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
    );
};
