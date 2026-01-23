const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const lorePath = path.join(projectRoot, 'src', 'data', 'lore.json');

function analyzeLore(data) {
    const report = {
        races: [],
        organizations: [],
        cities: [],
        regions: [],
        missingFiles: []
    };

    // Helper to check file existence
    const checkFile = (ref) => {
        if (!ref) return;
        const relativePath = ref.startsWith('/') ? ref.slice(1) : ref;
        const fullPath = path.join(projectRoot, 'src', relativePath);
        if (!fs.existsSync(fullPath)) {
            report.missingFiles.push(ref);
        }
    };

    // 1. Planes & Continents & Regions & Cities
    if (data.planes) {
        data.planes.forEach(plane => {
            if (plane.continents) {
                plane.continents.forEach(continent => {
                    // Races
                    if (continent.races) {
                        continent.races.forEach(race => {
                            if (!race.image) report.races.push({ name: race.name, id: race.id, missingRef: true });
                            else checkFile(race.image);
                        });
                    }
                    // Regions
                    if (continent.regions) {
                        continent.regions.forEach(region => {
                            if (!region.image) report.regions.push({ name: region.name, continent: continent.name, missingRef: true });
                            else checkFile(region.image);

                            // Cities
                            if (region.cities) {
                                region.cities.forEach(city => {
                                    if (!city.image) report.cities.push({ name: city.name, region: region.name, missingRef: true });
                                    else checkFile(city.image);
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    // 2. Organizations
    if (data.organizations) {
        data.organizations.forEach(org => {
            if (!org.image) report.organizations.push({ name: org.name, id: org.id, missingRef: true });
            else checkFile(org.image);
        });
    }

    // 3. Bestiary
    if (data.bestiary) {
        // data.bestiary seems to be an array based on file view
        data.bestiary.forEach(beast => {
            if (!beast.image) report.races.push({ name: beast.name, type: 'bestiary', missingRef: true }); // Grouping with races for simplicity
            else checkFile(beast.image);
        });
    }

    return report;
}

try {
    const loreData = JSON.parse(fs.readFileSync(lorePath, 'utf8'));
    const analysis = analyzeLore(loreData);

    console.log(JSON.stringify(analysis, null, 2));

} catch (err) {
    console.error('Error:', err);
}
