const fs = require('fs');
const path = require('path');

const LORE_PATH = path.join(__dirname, '../src/data/lore.json');
const OUTPUT_PATH = path.join(__dirname, '../src/data/npc_prompts.json');

function processLore() {
    const rawData = fs.readFileSync(LORE_PATH, 'utf8');
    const lore = JSON.parse(rawData);
    const prompts = [];

    lore.planes.forEach(plane => {
        plane.continents.forEach(continent => {
            // Determine dominant race if possible (first one in list usually)
            const dominantRace = continent.races && continent.races.length > 0 ? continent.races[0].reskin : "Human";
            const continentName = continent.name;

            if (continent.regions) {
                continent.regions.forEach(region => {
                    if (region.cities) {
                        region.cities.forEach(city => {
                            if (!city.districts) return;

                            city.districts.forEach(district => {
                                if (!district.assets) return;

                                district.assets.forEach(asset => {
                                    // NPCs and Guards
                                    if (asset.type === 'npc' || asset.type === 'guard') {
                                        const race = dominantRace; // Default to dominant race
                                        const role = asset.role || asset.type;
                                        const desc = asset.desc || "";
                                        const appearance = asset.appearance || "";

                                        // Build Prompt
                                        const prompt = `Digital Art, RPG Portrait, ${race} ${role}, ${appearance}, ${desc}. Detailed face, character concept art, dark fantasy style, solid background --ar 2:3 --v 6.0`;

                                        prompts.push({
                                            id: asset.id,
                                            filename: asset.image ? path.basename(asset.image) : `${asset.id}.png`,
                                            prompt: prompt,
                                            context: `${continentName} - ${city.name}`
                                        });
                                    }

                                    // Shopkeepers
                                    if (asset.shopkeeper && asset.shopkeeper.image) {
                                        const race = dominantRace;
                                        const role = "Shopkeeper";
                                        const desc = asset.shopkeeper.desc || "";
                                        const quirk = asset.shopkeeper.quirk || "";

                                        const prompt = `Digital Art, RPG Portrait, ${race} ${role}, ${desc}, ${quirk}. Detailed face, character concept art, dark fantasy style, solid background --ar 2:3 --v 6.0`;

                                        prompts.push({
                                            id: `${asset.id}_shopkeeper`,
                                            filename: path.basename(asset.shopkeeper.image),
                                            prompt: prompt,
                                            context: `${continentName} - ${city.name} (Shop: ${asset.name})`
                                        });
                                    }
                                });
                            });
                        });
                    }
                });
            }
        });
    });

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(prompts, null, 2), 'utf8');
    console.log(`Generated ${prompts.length} NPC prompts to ${OUTPUT_PATH}`);
}

processLore();
