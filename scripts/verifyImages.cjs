const fs = require('fs');
const path = require('path');

// Helper to slugify (must match src/utils/helpers.tsx)
const slugify = (text) => text.toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'oe')
    .replace(/å/g, 'aa')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

// Load Data
const lorePath = path.join(__dirname, '../src/data/lore.json');
const lore = JSON.parse(fs.readFileSync(lorePath, 'utf8'));
const publicDir = path.join(__dirname, '../public');

const missingResources = [];
const existingResources = [];

const checkFile = (relPath, context) => {
    const fullPath = path.join(publicDir, relPath);
    if (fs.existsSync(fullPath)) {
        existingResources.push(relPath);
    } else {
        missingResources.push({ path: relPath, context });
    }
};

console.log('--- Checking Image Assets ---');

// 1. Continents (Maps)
// Pattern from ContinentPage: /assets/maps/${continent.id}.png
lore.planes.forEach(p => {
    p.continents.forEach(c => {
        checkFile(`/assets/maps/${c.id}.png`, `Continent Map: ${c.name}`);

        // Races
        c.races.forEach(r => {
            // Pattern from lore.json "image" field or implied?
            // Checking lore.json structure for explicit image fields
            if (r.image) {
                checkFile(r.image, `Race: ${r.name}`);
            } else {
                // Fallback or convention if any?
                checkFile(`/assets/races/${slugify(r.name)}.png`, `Race (Implied): ${r.name}`);
            }
        });

        // Regions and Cities
        c.regions.forEach(reg => {
            // Cities
            reg.cities.forEach(city => {
                // Pattern from CityPage: /assets/cities/${slugify(city.name)}.png
                checkFile(`/assets/cities/${slugify(city.name)}.png`, `City Map: ${city.name}`);
            });
        });
    });
});

console.log(`\nFound ${missingResources.length} missing images.`);
console.log('--- Missing Images List ---');
missingResources.forEach(m => console.log(`[${m.context}] -> ${m.path}`));
