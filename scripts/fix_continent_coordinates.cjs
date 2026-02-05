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

console.log('Analyzing Plane -> Continent Coordinates...');

lore.planes.forEach(plane => {
    console.log(`Checking Plane: ${plane.name}`);

    // Check Continents
    plane.continents.forEach(cont => {
        if (!cont.coordinates) {
            const coords = getStubCoordinates(cont.name);
            console.log(`  [MISSING] Continent: ${cont.name} -> assigning stub (${coords.x}, ${coords.y})`);
            cont.coordinates = coords;
            updated = true;
        } else {
            console.log(`  [OK] Continent: ${cont.name}`);
        }
    });
});

if (updated) {
    console.log('Saving updates to lore.json...');
    fs.writeFileSync(LORE_PATH, JSON.stringify(lore, null, 2));
} else {
    console.log('All Continents already have coordinates.');
}
