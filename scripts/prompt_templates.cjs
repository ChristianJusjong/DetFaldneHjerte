/**
 * Shared Prompt Templates for Det faldne hjerte
 * Based on Art Bible v1.0
 */

module.exports = {
    // --- MAPS ---
    maps: {
        world: {
            prompt: "A flat 2D fantasy world map, complete atlas view showing all continents and oceans. Style of high-fantasy cartography, vintage parchment texture, faded ink. Distinct continental shapes, separated by clear oceans. No text labels. --ar 2:1 --v 6.0 --stylize 250 --no grid, spherical distortion, 3D"
        },
        side: {
            prompt: "A fantasy map of a large hemisphere landmass. Political map style. Distinct colored regions defining borders between nations. Marked locations for capital cities using large star icons. Neutral paper background. Clean lines. --ar 16:9 --v 6.0 --no mountains, realistic terrain, text labels, grid"
        },
        continent: (biome, visualSummary) => {
            return `A top-down fantasy map of a single continent [${biome}]. ${visualSummary}. Detailed physical geography: distinct mountain chains, winding rivers, dense swamps. Thick dark lines indicating major roads connecting specific red dot markers for cities. Parchment style with hand-drawn aesthetic. --ar 3:2 --v 6.0 --no grid, text, labels, realistic satellite`;
        },
        region: (areaType, visualSummary) => {
            return `An illustrated top-down regional map of [${areaType}]. ${visualSummary}. Focus on connectivity: clear dirt roads connecting small village clusters. Varied terrain: patches of forest, farmland, and hills. Icons indicating towns (squares) and a large Capitol (castle icon). Style of a high-definition RPG game map. --ar 16:9 --v 6.0 --no grid, clouds, fog, isometric`;
        },
        city: (cityType, layout, visualSummary, landmarks) => {
            return `A strict top-down orthographic city map of [${cityType}], ${layout}. ${visualSummary}. View from directly above (90 degrees). Visible rooftops of houses, distinct cobblestone streets. Clear landmarks: ${landmarks}. Sunlit, high contrast. --ar 4:3 --v 6.0 --no isometric, angled, side-view, perspective, grid, text`;
        },
        battlemap: (context, mood, texture) => {
            return `A top-down tabletop RPG battlemap of [${context}]. Strictly orthographic projection, 90-degree angle looking down. Flat 2D floorplan. High contrast between floor and walls. Lighting: ${mood}. Texture: ${texture}. --ar 16:9 --v 6.0 --no isometric, 3D, perspective, angled, roof, ceiling, overlay, grid`;
        }
    },

    // --- CHARACTERS ---
    // Context: "Human Guard", "Elf Shopkeeper"
    portrait: (race, role, appearance, description) => {
        return `Digital Art, RPG Portrait, ${race} ${role}, ${appearance}, ${description}. Detailed face, character concept art, dark fantasy style, solid background --ar 2:3 --v 6.0 --stylize 200`;
    },

    // --- ITEMS ---
    item: (name, description) => {
        return `Fantasy RPG Item Card, ${name}, ${description}. Isolated on black background, intricate detail, magical artifact style, professional game asset --ar 1:1 --v 6.0`;
    },

    // --- LOCATIONS / SCENIC ---
    scenic: (name, atmosphere, architecture) => {
        return `Atmospheric concept art of ${name}. ${atmosphere}. ${architecture}. Cinematic lighting, establishing shot, immersive perspective, dark fantasy RPG style. --ar 16:9 --v 6.0 --stylize 250`;
    },

    // --- INTERIORS (Shops/Taverns) ---
    interior: (type, atmosphere) => {
        return `Interior concept art of a fantasy ${type}. ${atmosphere}. First-person view, warm lighting, detailed clutter, inviting but mysterious. --ar 16:9 --v 6.0`;
    },

    // --- EMBLEMS (Factions/Orgs) ---
    emblem: (name, description) => {
        return `Vector style emblem for a fantasy faction: ${name}. ${description}. Minimalist, flat design, white on black background, clean lines, high contrast. --ar 1:1 --v 6.0 --no shading, 3D, text`;
    },

    // --- GODS ---
    god: (name, domain, symbol) => {
        return `Divine concept art of ${name}, god of ${domain}. Ethereal, imposing presence. Holding symbol: ${symbol}. Dramatic lighting, religious iconography, oil painting style. --ar 2:3 --v 6.0`;
    }
};
