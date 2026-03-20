/**
 * Shared Prompt Templates for Det faldne hjerte
 * Based on Art Bible v1.0
 */

module.exports = {
    // --- MAPS ---
    maps: {
        world: {
            prompt: "A high-detail 2D fantasy world map illustration in the style of Inkarnate. Complete atlas view showing all continents and oceans. Vibrant and saturated biome colors (deep green forests, snowy white peaks, sandy tan deserts). Highly detailed hand-drawn icons for mountain ranges, pine forests, and fortified castles. Stylized coastlines with subtle depth shadows and rippling water effects. Professional tabletop game aesthetic. --ar 2:1 --v 6.0 --stylize 300 --no grid, text, labels, realistic satellite, 3D"
        },
        side: {
            prompt: "A detailed fantasy map illustration of a large hemisphere landmass, D&D old-school style. Distinct colored regions with clean-line borders. Stylized illustrated icons for capital cities (towers and citadels). Clear geography with hand-drawn mountains and rivers. Vibrant fantasy aesthetic on a clean background. --ar 16:9 --v 6.0 --stylize 250 --no realistic terrain, text labels, grid, 3D"
        },
        continent: (biome, visualSummary) => {
            return `A high-detail top-down fantasy map illustration of the continent [${biome}]. ${visualSummary}. Style of an Inkarnate regional map. Detailed illustrated physical geography: hand-drawn mountain chains, winding vibrant rivers, dense illustrated forests. Stylistic icons for cities (castles and towers). Vibrant colors, clean lines, high-contrast tabletop RPG aesthetic. --ar 3:2 --v 6.0 --stylize 300 --no grid, text, labels, realistic satellite, 3D`;
        },
        region: (areaType, visualSummary) => {
            return `An illustrated top-down regional fantasy map of [${areaType}]. ${visualSummary}. Focus on landmarks: highly detailed illustrated icons for village clusters, ancient groves, and stone bridges. Varied vibrant terrain: distinct patches of autumn forest, rolling hills, and farmland. Bold castle icons for capitals. Style of a modern high-definition tabletop RPG game map (Inkarnate style). --ar 16:9 --v 6.0 --stylize 250 --no grid, realistic clouds, side-view`;
        },
        city: (cityType, layout, visualSummary, landmarks) => {
            return `A strict top-down orthographic illustrated city map of [${cityType}], ${layout}. ${visualSummary}. View from directly above (90 degrees). Hand-drawn rooftops, distinct paved streets, lush gardens. Clear illustrated landmarks: ${landmarks}. Vibrant, high contrast, clean miniature style. --ar 4:3 --v 6.0 --no side-view, perspective, grid, text, 3D`;
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
