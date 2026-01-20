import useSound from 'use-sound';
import { useGameStore } from '../store/useGameStore';

// Note: Ensure audio files exist in public/assets/audio/
// You can use placeholders or download free assets for these.
const SOUND_PATHS = {
    click: '/assets/audio/ui-click.mp3',
    hover: '/assets/audio/ui-hover.mp3',
    success: '/assets/audio/magic-success.mp3',
    pageTurn: '/assets/audio/page-flip.mp3',
};

export const useSoundEffects = () => {
    const { soundEnabled, volume } = useGameStore();

    const [playClick] = useSound(SOUND_PATHS.click, { volume, soundEnabled });
    const [playHover] = useSound(SOUND_PATHS.hover, { volume: volume * 0.5, soundEnabled }); // Lower volume for hover
    const [playSuccess] = useSound(SOUND_PATHS.success, { volume, soundEnabled });
    const [playPageTurn] = useSound(SOUND_PATHS.pageTurn, { volume, soundEnabled });

    return {
        playClick,
        playHover,
        playSuccess,
        playPageTurn
    };
};
