const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/modules/planes.json'), 'utf8'));

data.forEach(plane => {
    console.log(`Plane: ${plane.name} (${plane.id})`);
    if (plane.continents) {
        plane.continents.forEach(cont => {
            console.log(`  Continent: ${cont.name} (${cont.id})`);
            if (cont.regions) {
                // cont.regions.forEach(reg => {
                //     console.log(`    Region: ${reg.name} (${reg.id})`);
                // });
            }
        });
    }
});
