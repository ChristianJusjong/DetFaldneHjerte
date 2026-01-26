
import fs from 'fs';

const lore = JSON.parse(fs.readFileSync('./src/data/lore.json', 'utf8'));

console.log("World Analysis:");
lore.planes.forEach(plane => {
    console.log(`Plane: ${plane.name}`);
    plane.continents.forEach(cont => {
        console.log(`  Continent: ${cont.name} (${cont.id})`);
        console.log(`    Desc: ${cont.description.substring(0, 50)}...`);
        if (cont.regions) {
            cont.regions.forEach(reg => {
                console.log(`    Region: ${reg.name}`);
            });
        }
    });
});
