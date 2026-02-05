const fs = require('fs');
const path = require('path');

const LORE_PATH = path.join(__dirname, '../src/data/lore.json');
const PROMPTS_PATH = path.join(__dirname, '../src/data/image_prompts.json');
const lore = JSON.parse(fs.readFileSync(LORE_PATH, 'utf8'));

const prompts = [];

function generatePrompt(type, entity, context) {
    if (entity.image) return; // Skip if exists

    let base = `fantasy art, ${type}, ${entity.name}, ${context}, `;
    let desc = entity.desc || "";

    // Style keywords based on context
    if (context.includes("Lys-Siden")) base += "ethereal, glowing light, divine, ";
    if (context.includes("Skygge-Siden")) base += "dark, ominous, shadows, purple and black, ";
    if (context.includes("Tanke-Tinderne")) base += "crystalline, mental structures, geometric, ";
    if (context.includes("Spejl-Søen")) base += "reflective, water, glass, prism, ";
    if (context.includes("Klang-Dalene")) base += "vibrating, sound waves, cymatics, bronze, ";
    if (context.includes("Sølvtunge-Næsset")) base += "luxurious, gold, silk, spices, opulence, ";

    // Entity specific
    if (type === 'Shop') base += "interior view, items on display, detailed shelves, cozy lighting, ";
    if (type === 'God') base += "majestic, portrait, divine aura, intense gaze, masterpiece, ";
    if (type === 'Bestiary') base += "creature design, monster, detailed texture, dynamic pose, ";
    if (type === 'District') base += "city street, architecture, atmosphere, establishing shot, ";

    const fullPrompt = `${base} ${desc}, detailed, 8k, concept art`;

    let folder = 'misc';
    if (type === 'God') folder = 'gods';
    if (type === 'Bestiary') folder = 'bestiary';
    if (type === 'Organization') folder = 'organizations';
    if (type === 'District') folder = 'districts';
    if (type === 'Shop' || type === 'Asset') folder = 'shops';

    let id = entity.id;

    // Force context prefix for Districts/Shops to ensure unique filenames/paths
    // even if they have an ID (like 'centrum') which is shared across cities.
    if ((type === 'District' || type === 'Shop' || type === 'Asset') && context) {
        const cityContext = context.split(',')[0].toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, '');
        let base = id || entity.name.toLowerCase();
        base = base.replace(/\s/g, '-').replace(/[^a-z0-9-]/g, '');
        // Avoid double prefix if ID already includes it (unlikely but safe)
        if (!base.startsWith(cityContext)) {
            id = `${cityContext}-${base}`;
        } else {
            id = base;
        }
    }

    if (!id) {
        id = entity.name.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    const filename = `${id}.png`;
    const targetPath = `/assets/${folder}/${filename}`;

    prompts.push({
        id: id,
        name: entity.name,
        type: type,
        context: context,
        prompt: fullPrompt,
        targetPath: targetPath
    });
}

// Traverse
// 1. Root Entities
if (lore.religion && lore.religion.gods) lore.religion.gods.forEach(g => generatePrompt('God', g, 'Religion'));
if (lore.bestiary) lore.bestiary.forEach(b => generatePrompt('Bestiary', b, 'Monsters'));
if (lore.organizations) lore.organizations.forEach(o => generatePrompt('Organization', o, 'Factions'));

// 2. Geography
lore.planes.forEach(plane => {
    if (plane.continents) plane.continents.forEach(cont => {
        // generatePrompt('Continent', cont, plane.name);
        if (cont.regions) cont.regions.forEach(reg => {
            if (reg.cities) reg.cities.forEach(city => {
                if (city.districts) city.districts.forEach(dist => {
                    generatePrompt('District', dist, `${city.name}, ${reg.name}`);
                    if (dist.assets) dist.assets.forEach(asset => {
                        generatePrompt(asset.type === 'shop' ? 'Shop' : 'Asset', asset, `${city.name}`);
                    });
                });
            });
        });
    });
});

fs.writeFileSync(PROMPTS_PATH, JSON.stringify(prompts, null, 2));
console.log(`Generated ${prompts.length} prompts.`);
