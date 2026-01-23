const fs = require('fs');
const path = require('path');

// Mock slugify 
function simpleSlugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

const lorePath = path.join(__dirname, '../src/data/lore.json');
const rawData = fs.readFileSync(lorePath, 'utf8');
const data = JSON.parse(rawData);

// Backfill IDs for generic entities

// 1. Planes & Continents & Races
data.planes.forEach(plane => {
    if (!plane.id) plane.id = simpleSlugify(plane.name);

    plane.continents.forEach(cont => {
        if (!cont.id) cont.id = simpleSlugify(cont.name);

        cont.races.forEach(race => {
            if (!race.id) race.id = simpleSlugify(race.name);
        });
    });
});

// 2. Religion -> Gods
if (data.religion && data.religion.gods) {
    data.religion.gods.forEach(god => {
        if (!god.id) god.id = simpleSlugify(god.name);
    });
}

// 3. Organizations
if (data.organizations) {
    data.organizations.forEach(org => {
        if (!org.id) org.id = simpleSlugify(org.name);
    });
}

// 4. Conflict -> Factions
if (data.conflict && data.conflict.fractions) {
    data.conflict.fractions.forEach(faction => {
        if (!faction.id) faction.id = simpleSlugify(faction.name);
    });
}

// 5. Bestiary
if (data.bestiary) {
    data.bestiary.forEach(beast => {
        if (!beast.id) beast.id = simpleSlugify(beast.name);
    });
}

fs.writeFileSync(lorePath, JSON.stringify(data, null, 2));
console.log('Backfill complete: IDs added to lore.json.');
