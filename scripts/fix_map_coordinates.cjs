const fs = require('fs');
const path = require('path');

const LORE_PATH = path.join(__dirname, '../src/data/lore.json');
const lore = JSON.parse(fs.readFileSync(LORE_PATH, 'utf8'));

let updated = false;

// Helper to generate "stable" pseudo-random coordinates based on name hash
function getStubCoordinates(name) {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
        x: (hash % 60) + 20, // 20-80% to stay central
        y: ((hash * 13) % 60) + 20
    };
}

console.log('Analyzing Map Coordinates...');

lore.planes.forEach(plane => {
    plane.continents.forEach(cont => {
        console.log(`Checking Continent: ${cont.name}`);

        // Check Regions
        if (cont.regions) {
            cont.regions.forEach(reg => {
                if (!reg.coordinates) {
                    const coords = getStubCoordinates(reg.name);
                    console.log(`  [MISSING] Region: ${reg.name} -> assigning stub (${coords.x}, ${coords.y})`);
                    reg.coordinates = coords;
                    updated = true;
                } else {
                    console.log(`  [OK] Region: ${reg.name}`);
                }

                // Check Cities (if map logic exists for them too in future)
                // Currently focusing on Regions as per ContinentPage usage
            });
        }
    });
});

if (updated) {
    console.log('Saving updates to lore.json...');
    fs.writeFileSync(LORE_PATH, JSON.stringify(lore, null, 2));
} else {
    console.log('All locations already have coordinates.');
}
