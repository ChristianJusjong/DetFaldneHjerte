const fs = require('fs');
const path = require('path');

const LORE_PATH = path.join(__dirname, '../src/data/lore.json');

// Helper to slugify names for filenames
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
}

function processLore() {
    const rawData = fs.readFileSync(LORE_PATH, 'utf8');
    const lore = JSON.parse(rawData);
    let changes = 0;

    console.log('Starting handbook asset backfill...');

    lore.planes.forEach(plane => {
        plane.continents.forEach(continent => {
            continent.regions.forEach(region => {
                region.cities.forEach(city => {
                    if (!city.districts) return;

                    city.districts.forEach(district => {
                        if (!district.assets) return;

                        district.assets.forEach(asset => {
                            // 1. NPC Portraits & Tokens
                            if (asset.type === 'npc' || asset.type === 'guard') {
                                if (!asset.image) {
                                    asset.image = `/assets/portraits/${slugify(asset.name)}.png`;
                                    console.log(`Added portrait for NPC: ${asset.name}`);
                                    changes++;
                                }
                                if (!asset.tokenImage) {
                                    asset.tokenImage = `/assets/tokens/${slugify(asset.name)}.png`;
                                    console.log(`Added token for NPC: ${asset.name}`);
                                    changes++;
                                }
                            }

                            // 2. Shop/Location Interiors
                            // Shops often have an owner, so we might want a portrait for the owner too if they are named in 'shopkeeper'
                            if (asset.type === 'shop' || asset.type === 'location' || asset.type === 'landmark') {
                                if (!asset.interiorImage) {
                                    asset.interiorImage = `/assets/interiors/${slugify(asset.name)}.png`;
                                    console.log(`Added interior for: ${asset.name}`);
                                    changes++;
                                }

                                // 3. Shopkeeper Portraits (if detailed)
                                if (asset.shopkeeper && asset.shopkeeper.name && !asset.shopkeeper.image) {
                                    // We store shopkeeper portraits in the same folder
                                    asset.shopkeeper.image = `/assets/portraits/${slugify(asset.shopkeeper.name)}.png`;
                                    console.log(`Added portrait for Shopkeeper: ${asset.shopkeeper.name}`);
                                    changes++;
                                }

                                // 4. Item Cards
                                if (asset.inventory && Array.isArray(asset.inventory)) {
                                    asset.inventory.forEach(item => {
                                        if (!item.image) {
                                            item.image = `/assets/items/${slugify(item.name)}.png`;
                                            // console.log(`Added item art for: ${item.name}`); // Too noisy
                                            changes++;
                                        }
                                    });
                                }
                            }
                        });
                    });
                });
            });
        });
    });

    if (changes > 0) {
        fs.writeFileSync(LORE_PATH, JSON.stringify(lore, null, 2), 'utf8');
        console.log(`\nSuccess! Backfilled ${changes} missing asset paths.`);
    } else {
        console.log('\nNo changes needed. detailed asset paths already exist.');
    }
}

try {
    processLore();
} catch (error) {
    console.error('Error processing lore:', error);
}
