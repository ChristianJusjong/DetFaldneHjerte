const fs = require('fs');
const path = require('path');

const LORE_PATH = path.join(__dirname, '../src/data/lore.json');
const PROMPTS_PATH = path.join(__dirname, '../src/data/image_prompts.json');
const PUBLIC_DIR = path.join(__dirname, '../public');

const lore = JSON.parse(fs.readFileSync(LORE_PATH, 'utf8'));
const prompts = JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf8'));

let updatedCount = 0;

// Create a map of prompts by context+name to match back to entities? 
// Or just iterate lore and reconstruct IDs to check file existence?
// Reconstructing IDs is safer as it matches the generation logic.

function checkAndUpdate(type, entity, context) {
    if (entity.image) return; // Already has image

    let id = entity.id;
    // Reconstruction logic matching generate_image_prompts.cjs
    if ((type === 'District' || type === 'Shop' || type === 'Asset') && context) {
        const cityContext = context.split(',')[0].toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, '');
        let base = id || entity.name.toLowerCase();
        base = base.replace(/\s/g, '-').replace(/[^a-z0-9-]/g, '');
        if (!base.startsWith(cityContext)) {
            id = `${cityContext}-${base}`;
        } else {
            id = base;
        }
    }
    if (!id) {
        id = entity.name.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    let folder = 'misc';
    if (type === 'God') folder = 'gods';
    if (type === 'Bestiary') folder = 'bestiary';
    if (type === 'Organization') folder = 'organizations';
    if (type === 'District') folder = 'districts';
    if (type === 'Shop' || type === 'Asset') folder = 'shops';

    const filename = `${id}.png`;
    const relPath = `/assets/${folder}/${filename}`;
    const fullPath = path.join(PUBLIC_DIR, relPath);

    if (fs.existsSync(fullPath)) {
        console.log(`Found image for ${entity.name}: ${relPath}`);
        entity.image = relPath;
        updatedCount++;
    }
}

// 1. Root
if (lore.religion && lore.religion.gods) lore.religion.gods.forEach(g => checkAndUpdate('God', g, 'Religion'));
if (lore.bestiary) lore.bestiary.forEach(b => checkAndUpdate('Bestiary', b, 'Monsters'));
if (lore.organizations) lore.organizations.forEach(o => checkAndUpdate('Organization', o, 'Factions'));

// 2. Geography
lore.planes.forEach(plane => {
    if (plane.continents) plane.continents.forEach(cont => {
        if (cont.regions) cont.regions.forEach(reg => {
            if (reg.cities) reg.cities.forEach(city => {
                if (city.districts) city.districts.forEach(dist => {
                    checkAndUpdate('District', dist, `${city.name}, ${reg.name}`);
                    if (dist.assets) dist.assets.forEach(asset => {
                        checkAndUpdate(asset.type === 'shop' ? 'Shop' : 'Asset', asset, `${city.name}`);
                    });
                });
            });
        });
    });
});

if (updatedCount > 0) {
    fs.writeFileSync(LORE_PATH, JSON.stringify(lore, null, 2));
    console.log(`Updated ${updatedCount} entries in lore.json`);
} else {
    console.log('No new images found.');
}
