const fs = require('fs');
const path = require('path');
const LORE_PATH = path.join(__dirname, '../src/data/lore.json');

const lore = JSON.parse(fs.readFileSync(LORE_PATH, 'utf8'));

let found = false;

lore.planes.forEach((p, pi) => {
    if (p.continents) p.continents.forEach((c, ci) => {
        if (c.regions) c.regions.forEach((r, ri) => {
            if (r.name && r.name.includes("Bitter")) {
                console.log(`FOUND REGION MATCH: ${r.name} in ${c.name}`);
            }
            if (r.cities) r.cities.forEach((city, cyi) => {
                const cityName = city.name || "UNDEFINED";
                if (cityName.includes("Bitter")) {
                    console.log(`FOUND CITY MATCH: "${cityName}" (Districts: ${city.districts ? city.districts.length : 'undefined'})`);
                    console.log(`   -> Located in Region: ${r.name}, Continent: ${c.name}`);
                    found = true;
                }
                if (cityName === "UNDEFINED") {
                    console.log(`FOUND NAMELESS CITY! in Region: ${r.name}`);
                }
            });
        });
    });
});

if (!found) console.log("No city found matching 'Bitter'.");
