
const fs = require('fs');
const path = require('path');

const lore = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/lore.json'), 'utf8'));

console.log("Analyzing Lore Structure...");

const names = new Map(); // Name -> { type, path }

function check(name, type, ids) {
    const pathStr = ids.join(' -> ');
    if (name === 'Lys-Siden' || name === 'Skygge-Siden') {
        console.log(`[ALERT] Found '${name}' used as ${type} at: ${pathStr}`);
    }
    if (names.has(name)) {
        console.log(`[DUPLICATE] '${name}' defined as ${type} at ${pathStr}`);
        console.log(`            Previously defined as ${names.get(name).type} at ${names.get(name).path}`);
    } else {
        names.set(name, { type, path: pathStr });
    }
}

lore.planes.forEach(p => {
    check(p.name, 'Plane', [p.name]);
    p.continents.forEach(c => {
        check(c.name, 'Continent', [p.name, c.name]);
        c.regions.forEach(r => {
            check(r.name, 'Region', [p.name, c.name, r.name]);
            r.cities.forEach(city => {
                check(city.name, 'City', [p.name, c.name, r.name, city.name]);
            });
        });
    });
});

console.log("Analysis Complete.");
