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

console.log("Updating Planes...");
loreData.planes.forEach(plane => {
    // Determine slug from specific ID if known, or name
    // We used 'lyssiden' and likely 'skyggesiden' for the prompts
    // Let's force consistency with the prompt script

    // In map prompts we used plane.id directly. 
    // Let's check what IDs are:
    console.log(`Found Plane: ID=${plane.id}, Name=${plane.name}`);

    // Assign map path
    plane.mapImage = `/assets/maps/sides/${plane.id}.png`;
});

fs.writeFileSync(lorePath, JSON.stringify(loreData, null, 2), 'utf8');
console.log('Lore updated with standardized plane map paths.');
