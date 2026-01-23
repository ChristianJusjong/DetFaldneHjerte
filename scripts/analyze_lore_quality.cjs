const fs = require('fs');
const path = require('path');

const lorePath = path.join(__dirname, '../src/data/lore.json');
const loreData = JSON.parse(fs.readFileSync(lorePath, 'utf8'));

const weakEntries = [];

function checkDescription(type, name, desc) {
    if (!desc || desc.length < 50 || desc.includes("Generic description")) {
        return "Too short/Generic";
    }
    // Check for lack of visual keywords
    const visualKeywords = ['building', 'street', 'light', 'shadow', 'color', 'stone', 'wood', 'glass', 'mountain', 'river', 'sky', 'tower', 'wall', 'ruin'];
    const hasVisuals = visualKeywords.some(w => desc.toLowerCase().includes(w));
    if (!hasVisuals) return "Lacks visual keywords";

    return null;
}

loreData.planes.forEach(plane => {
    if (plane.continents) {
        plane.continents.forEach(cont => {
            const issue = checkDescription('Continent', cont.name, cont.description);
            if (issue) weakEntries.push({ type: 'Continent', name: cont.name, issue, desc: cont.description });

            if (cont.regions) {
                cont.regions.forEach(reg => {
                    const rIssue = checkDescription('Region', reg.name, reg.desc);
                    if (rIssue) weakEntries.push({ type: 'Region', name: reg.name, issue, desc: reg.desc });

                    if (reg.cities) {
                        reg.cities.forEach(city => {
                            const cIssue = checkDescription('City', city.name, city.desc);
                            if (cIssue) weakEntries.push({ type: 'City', name: city.name, issue, desc: city.desc });
                        });
                    }
                });
            }
        });
    }
});

console.log(JSON.stringify(weakEntries, null, 2));
console.log(`Found ${weakEntries.length} weak entries.`);
