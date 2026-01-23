const fs = require('fs');
const path = require('path');

const lorePath = path.join(__dirname, '../src/data/lore.json');
const loreData = JSON.parse(fs.readFileSync(lorePath, 'utf8'));

// Regional Visual Themes (English, for Prompting)
const visualThemes = {
    // Lys-Siden
    "tanke-tinderne": "A majestic mountain range with spiral peaks piercing the clouds, constant storms of blue lightning, white marble towers, cold clinical atmosphere.",
    "minde-dalene": "Deep canyon valleys echoing with sound, massive stone archives carved into cliff faces, glowing crystals embedded in rock, foggy and mysterious.",
    "spejl-soeen": "A vast, perfectly still mirror-like lake reflecting a double sky, islands floating slightly above water, iridescent mist, dreamlike and serene.",
    "klang-dalene": "Rolling hills that look like soundwaves, trees that chime in the wind, architecture based on musical instruments, vibrant acoustic resonance.",

    // Skygge-Siden
    "solvtunge-naesset": "A dark coastal peninsula with jagged black rocks, silver fog rolling in from a dark ocean, architecture of twisted iron and black stone, shady and mercantile.",
    "tvillinge-oerne": "Two identical islands connected by bridges of light, symmetry in all things, lush twilight forests, bio-luminescent flora.",
    "urskoven": "A primordial jungle of impossible scale, trees piercing the sky, red rivers of thick fluid, massive insects, savage and unchecked growth, green and crimson palette.",
    "slam-sumpen": "A toxic wasteland of neon-green acid pools, rusted industrial pipes weaving through mud, steam vents, scavenged scrap cities, cyberpunk-meets-fantasy decay."
};

function getTheme(provinceId) {
    // distinct match
    for (const key of Object.keys(visualThemes)) {
        if (provinceId && provinceId.includes(key)) return visualThemes[key];
    }
    // loose match
    return "Fantasy landscape with distinct magical features.";
}

// Helper to translate common Danish terms to English visuals
function translateVisuals(danishDesc) {
    let desc = danishDesc.toLowerCase();
    const map = {
        'sump': 'swamp',
        'skov': 'forest',
        'bjerg': 'mountain',
        'tårn': 'tower',
        'by': 'city',
        'havn': 'harbor',
        'fæstning': 'fortress',
        'lys': 'light',
        'mørke': 'darkness',
        'krystal': 'crystal',
        'rør': 'pipes',
        'mudder': 'mud',
        'steril': 'sterile',
        'blod': 'blood',
        'knogler': 'bones'
    };

    let visualTags = [];
    Object.keys(map).forEach(key => {
        if (desc.includes(key)) visualTags.push(map[key]);
    });

    return visualTags.join(', ');
}

loreData.planes.forEach(plane => {
    if (plane.continents) {
        plane.continents.forEach(cont => {
            const contTheme = getTheme(cont.id);
            cont.visualSummary = `${contTheme} Specific features: ${translateVisuals(cont.description)}.`;

            if (cont.regions) {
                cont.regions.forEach(reg => {
                    // Region visual summary
                    reg.visualSummary = `Region in ${cont.name}. ${contTheme} Local terrain: ${translateVisuals(reg.desc)}.`;

                    if (reg.cities) {
                        reg.cities.forEach(city => {
                            // City visual summary
                            const simpleTranslation = translateVisuals(city.desc);
                            const cityType = simpleTranslation.includes('harbor') ? 'Port City' :
                                simpleTranslation.includes('fortress') ? 'Fortress City' :
                                    simpleTranslation.includes('mountain') ? 'Mountain City' : 'Settlement';

                            city.visualSummary = `${cityType} located in ${reg.name}. Aesthetic: ${contTheme} distinct features: ${simpleTranslation}. Layout: ${city.layout || 'Organic'}.`;
                        });
                    }
                });
            }
        });
    }
});

fs.writeFileSync(lorePath, JSON.stringify(loreData, null, 2), 'utf8');
console.log('Enriched lore.json with visualSummary fields.');
