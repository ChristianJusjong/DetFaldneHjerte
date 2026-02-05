export const SoundMapping: Record<string, string> = {
    'default': '/assets/audio/dungeon-ambience.mp3',
    '/planes': '/assets/audio/ethereal-winds.mp3',
    '/planes/ild': '/assets/audio/fire-ambience.mp3',
    '/cities': '/assets/audio/city-market.mp3',
    '/religion': '/assets/audio/temple-chant.mp3',
};

export const getSoundForPath = (path: string): string => {
    // Exact match
    if (SoundMapping[path]) return SoundMapping[path];

    // Partial match (e.g. /planes/ild/some-location -> /planes/ild)
    // Sort keys by length (descending) to find most specific match first
    const keys = Object.keys(SoundMapping).sort((a, b) => b.length - a.length);

    for (const key of keys) {
        if (key !== 'default' && path.startsWith(key)) {
            return SoundMapping[key];
        }
    }

    return SoundMapping['default'];
};
