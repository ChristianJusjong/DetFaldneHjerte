const fs = require('fs');
const path = require('path');

const lorePath = path.join(__dirname, '../src/data/lore.json');
const loreData = JSON.parse(fs.readFileSync(lorePath, 'utf8'));

// Helper to slugify
const slugify = (text) => text.toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'oe')
    .replace(/å/g, 'aa')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

loreData.planes.forEach(plane => {
    if (plane.continents) {
        plane.continents.forEach(cont => {
            if (cont.regions) {
                cont.regions.forEach(reg => {
                    const regSlug = slugify(reg.name);
                    // Add battlemap path for wilderness encounter
                    reg.battlemapImage = `/assets/maps/battlemaps/${regSlug}-encounter.png`;

                    if (reg.cities) {
                        reg.cities.forEach(city => {
                            const citySlug = slugify(city.name);
                            // Add battlemap path for urban encounter
                            city.battlemapImage = `/assets/maps/battlemaps/${citySlug}-encounter.png`;
                        });
                    }
                });
            }
        });
    }
});

fs.writeFileSync(lorePath, JSON.stringify(loreData, null, 2), 'utf8');
console.log('Lore updated with standardized battlemap paths.');
