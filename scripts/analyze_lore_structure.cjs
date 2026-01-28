const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/lore.json', 'utf8'));

data.planes.forEach((plane, pIdx) => {
    console.log(`Plane [${pIdx}]: ${plane.name} (${plane.id})`);
    if (plane.continents) {
        plane.continents.forEach((cont, cIdx) => {
            console.log(`  Continent [${cIdx}]: ${cont.name} (${cont.id})`);
            if (cont.regions) {
                cont.regions.forEach((reg, rIdx) => {
                    console.log(`    Region [${rIdx}]: ${reg.name} (${reg.id || 'no-id'})`);
                    if (reg.cities) {
                        reg.cities.forEach((city, cityIdx) => {
                            console.log(`      City [${cityIdx}]: ${city.name}`);
                        });
                    }
                });
            }
        });
    }
});
