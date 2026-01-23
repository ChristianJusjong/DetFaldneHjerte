const fs = require('fs');
const path = require('path');

const LORE_PATH = path.join(__dirname, '../src/data/lore.json');
const OUTPUT_PATH = path.join(__dirname, '../src/data/interior_prompts.json');

function processLore() {
    const rawData = fs.readFileSync(LORE_PATH, 'utf8');
    const lore = JSON.parse(rawData);
    const prompts = [];

    lore.planes.forEach(plane => {
        plane.continents.forEach(continent => {
            const continentName = continent.name;
            const regionStyle = continent.socialDynamics?.environment || "Fantasy";

            continent.regions.forEach(region => {
                region.cities.forEach(city => {
                    const cityStyle = city.architecture || "Medieval fantasy";
                    const atmosphere = city.atmosphere || "Mysterious";

                    if (!city.districts) return;

                    city.districts.forEach(district => {
                        if (!district.assets) return;

                        district.assets.forEach(asset => {
                            if ((asset.type === 'shop' || asset.type === 'location' || asset.type === 'landmark') && asset.interiorImage) {

                                const type = asset.subtype || asset.type;
                                const desc = asset.desc || "";

                                // Construct a rich prompt
                                const prompt = `RPG visual novel background, interior of a ${type} named "${asset.name}". ${desc}. Context: ${cityStyle}, ${atmosphere}. First person view, highly detailed, atmospheric lighting, detailed clutter, immersive --ar 16:9 --v 6.0`;

                                prompts.push({
                                    id: asset.id,
                                    filename: path.basename(asset.interiorImage),
                                    prompt: prompt,
                                    context: `${continentName} - ${city.name} - ${asset.name}`
                                });
                            }
                        });
                    });
                });
            });
        });
    });

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(prompts, null, 2), 'utf8');
    console.log(`Generated ${prompts.length} Interior prompts to ${OUTPUT_PATH}`);
}

processLore();
