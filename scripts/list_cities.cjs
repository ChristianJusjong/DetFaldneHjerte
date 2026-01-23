const fs = require('fs');
const path = require('path');

const lorePath = path.join(__dirname, '../src/data/lore.json');

try {
    const loreData = JSON.parse(fs.readFileSync(lorePath, 'utf8'));
    const cities = [];

    loreData.planes.forEach(plane => {
        plane.continents.forEach(continent => {
            continent.regions.forEach(region => {
                region.cities.forEach(city => {
                    cities.push({
                        name: city.name,
                        desc: city.desc,
                        continent: continent.name,
                        region: region.name
                    });
                });
            });
        });
    });

    console.log(JSON.stringify(cities, null, 2));
} catch (error) {
    console.error('Error reading or parsing lore.json:', error);
}
