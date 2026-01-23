const fs = require('fs');
const path = require('path');

const LORE_PATH = path.join(__dirname, '../src/data/lore.json');
const OUTPUT_PATH = path.join(__dirname, '../src/data/item_prompts.json');

function processLore() {
    const rawData = fs.readFileSync(LORE_PATH, 'utf8');
    const lore = JSON.parse(rawData);
    const prompts = [];
    const processedItems = new Set(); // To avoid duplicates for common items

    lore.planes.forEach(plane => {
        plane.continents.forEach(continent => {
            continent.regions.forEach(region => {
                region.cities.forEach(city => {
                    if (!city.districts) return;

                    city.districts.forEach(district => {
                        if (!district.assets) return;

                        district.assets.forEach(asset => {
                            if (asset.inventory && Array.isArray(asset.inventory)) {
                                asset.inventory.forEach(item => {
                                    if (!item.image) return;

                                    // Deduplicate based on item name to save generation costs
                                    // if multiple shops sell "Læge-urt", we only generate it once.
                                    if (processedItems.has(item.name)) return;
                                    processedItems.add(item.name);

                                    const desc = item.desc || "Magical item";
                                    const prompt = `Fantasy RPG Item Card, ${item.name}, ${desc}. Isolated on black background, intricate detail, magical artifact style, professional game asset --ar 1:1 --v 6.0`;

                                    prompts.push({
                                        filename: path.basename(item.image),
                                        prompt: prompt,
                                        context: `Item: ${item.name}`
                                    });
                                });
                            }
                        });
                    });
                });
            });
        });
    });

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(prompts, null, 2), 'utf8');
    console.log(`Generated ${prompts.length} Item prompts to ${OUTPUT_PATH}`);
}

processLore();
