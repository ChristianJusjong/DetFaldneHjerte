const fs = require('fs');
const path = require('path');

const lorePath = path.join(__dirname, '../src/data/lore.json');
const assetsPath = path.join(__dirname, '../src/assets/races');
const loreData = JSON.parse(fs.readFileSync(lorePath, 'utf8'));

if (!fs.existsSync(assetsPath)) {
    fs.mkdirSync(assetsPath, { recursive: true });
}

const existing = fs.readdirSync(assetsPath);
const missing = [];

loreData.planes.forEach(plane => {
    if (plane.continents) {
        plane.continents.forEach(continent => {
            if (continent.races) {
                continent.races.forEach(race => {
                    const slug = race.image.split('/').pop().replace('.png', ''); // extract slug from path I just set
                    if (!existing.includes(`${slug}.png`)) {
                        missing.push({
                            name: race.name,
                            slug: slug,
                            description: race.description,
                            reskin: race.reskin,
                            mechanic: race.mechanic // provides visual flavor often
                        });
                    }
                });
            }
        });
    }
});

console.log(JSON.stringify(missing, null, 2));
