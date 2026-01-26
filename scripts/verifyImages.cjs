const fs = require('fs');
const path = require('path');

// Helper to slugify
// Helper to slugify
const slugify = (text) => {
    if (!text) return 'unknown';
    return text.toLowerCase()
        .replace(/æ/g, 'ae')
        .replace(/ø/g, 'oe')
        .replace(/å/g, 'aa')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
}

// Load Data
const lorePath = path.join(__dirname, '../src/data/lore.json');
const lore = JSON.parse(fs.readFileSync(lorePath, 'utf8'));
const publicDir = path.join(__dirname, '../public');

// Output container
const missingResources = [];
const existingResources = [];

const checkFile = (relPath, context, type, data = {}) => {
    if (!relPath) return; // Skip if no path defined (though we should report that too if expected)

    const fullPath = path.join(publicDir, relPath);
    if (fs.existsSync(fullPath)) {
        existingResources.push(relPath);
    } else {
        missingResources.push({
            path: relPath,
            context,
            type,
            data // Pass extra data needed for prompt generation (e.g. description, race, role)
        });
    }
};

console.log('--- Checking Image Assets ---');

// 1. GLOBAL ENTITIES
// ------------------

// Gods
if (lore.religion && lore.religion.gods) {
    lore.religion.gods.forEach(god => {
        // Expected path: /assets/gods/[id].png
        const p = god.image || `/assets/gods/${god.id}.png`;
        checkFile(p, `God: ${god.name}`, 'god', god);
    });
}

// Factions/Orgs
if (lore.organizations) {
    lore.organizations.forEach(org => {
        const p = org.image || `/assets/organizations/${org.id}.png`;
        checkFile(p, `Org: ${org.name}`, 'emblem', org);
    });
}
if (lore.conflict && lore.conflict.fractions) {
    lore.conflict.fractions.forEach(frac => {
        const p = frac.image || `/assets/organizations/${frac.id}.png`;
        checkFile(p, `Faction: ${frac.name}`, 'emblem', frac);
    });
}

// Bestiary
if (lore.bestiary) {
    lore.bestiary.forEach(b => {
        const p = b.image || `/assets/bestiary/${b.id}.png`;
        checkFile(p, `Beast: ${b.name}`, 'portrait', { ...b, race: b.name, role: 'Monster' });
    });
}

// 2. WORLD ATLAS
// --------------

// Planes
lore.planes.forEach(p => {
    // Side Maps
    checkFile(`/assets/maps/sides/${p.id}.png`, `Plane Map: ${p.name}`, 'side_map', p);

    if (p.continents) {
        p.continents.forEach(c => {
            // Continent Map
            // Legacy check: some might be at /assets/maps/[id].png or /assets/maps/continents/[id].png
            // We strictly enforce /assets/maps/continents/ now based on plan, or check existing
            const mapPath = c.mapImage || `/assets/maps/continents/${c.id}.png`;
            checkFile(mapPath, `Continent Map: ${c.name}`, 'continent_map', c);

            // Races
            if (c.races) {
                c.races.forEach(r => {
                    const raceSlug = slugify(r.name);
                    const racePath = r.image || `/assets/races/${raceSlug}.png`;
                    checkFile(racePath, `Race: ${r.name}`, 'portrait', { ...r, role: 'Representative' });
                });
            }

            // Regions
            if (c.regions) {
                c.regions.forEach(reg => {
                    const regSlug = slugify(reg.name);

                    // Region Map
                    checkFile(`/assets/maps/regions/${regSlug}.png`, `Region Map: ${reg.name}`, 'region_map', { ...reg, areaType: 'region' }); // simplify data passing

                    // Region Battlemap
                    checkFile(`/assets/maps/battlemaps/${regSlug}-encounter.png`, `Battlemap: ${reg.name}`, 'battlemap', { ...reg, context: reg.name });

                    // Cities
                    if (reg.cities) {
                        reg.cities.forEach(city => {
                            const citySlug = slugify(city.name);

                            // City Map
                            checkFile(`/assets/maps/cities/${citySlug}.png`, `City Map: ${city.name}`, 'city_map', city);

                            // City Scenic/Image
                            checkFile(`/assets/cities/${citySlug}.png`, `City Scenic: ${city.name}`, 'scenic', { ...city, name: city.name });

                            // City Battlemap
                            checkFile(`/assets/maps/battlemaps/${citySlug}-encounter.png`, `Battlemap: ${city.name}`, 'battlemap', { ...city, context: city.name });

                            // Districts & Assets
                            if (city.districts) {
                                city.districts.forEach(dist => {
                                    if (dist.assets) {
                                        dist.assets.forEach(asset => {
                                            // Asset ID
                                            const assetSlug = asset.id;

                                            // 1. Main Asset Image
                                            if (asset.type === 'shop') {
                                                // Exterior / Shop Interior?
                                                // Let's assume interior for shops as per new plan
                                                const interiorPath = asset.interiorImage || `/assets/interiors/${assetSlug}.png`;
                                                checkFile(interiorPath, `Shop Interior: ${asset.name}`, 'interior', { ...asset, atmosphere: city.atmosphere });

                                                // Shopkeeper
                                                if (asset.shopkeeper) {
                                                    const skPath = asset.shopkeeper.image || `/assets/npc/${assetSlug}-keeper.png`;
                                                    checkFile(skPath, `Shopkeeper: ${asset.shopkeeper.name}`, 'portrait', {
                                                        race: 'Human', // Needs better inference
                                                        role: 'Shopkeeper',
                                                        appearance: asset.shopkeeper.desc,
                                                        description: asset.shopkeeper.quirk
                                                    });
                                                }

                                                // Inventory
                                                if (asset.inventory) {
                                                    asset.inventory.forEach(item => {
                                                        if (item.image) {
                                                            checkFile(item.image, `Item: ${item.name}`, 'item', item);
                                                        }
                                                    });
                                                }

                                            } else if (asset.type === 'npc' || asset.type === 'guard') {
                                                const npcPath = asset.image || `/assets/npc/${assetSlug}.png`;
                                                checkFile(npcPath, `NPC: ${asset.name}`, 'portrait', {
                                                    race: 'Human', // Needs inference
                                                    role: asset.role || asset.type,
                                                    appearance: asset.appearance,
                                                    description: asset.desc
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

// Summary
console.log(`\nFound ${missingResources.length} missing images.`);
// Output structured JSON for the generator script to consume
const reportPath = path.join(__dirname, '../src/data/missing_assets_report.json');
fs.writeFileSync(reportPath, JSON.stringify(missingResources, null, 2), 'utf8');
console.log(`Detailed report saved to ${reportPath}`);
