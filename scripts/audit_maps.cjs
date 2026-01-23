const fs = require('fs');
const path = require('path');

const lorePath = path.join(__dirname, '../src/data/lore.json');
const assetsPath = path.join(__dirname, '../src/assets');
const loreData = JSON.parse(fs.readFileSync(lorePath, 'utf8'));

const report = {
    continents: { total: 0, missing: [] },
    cities: { total: 0, missing: [] }
};

function checkFile(subDir, name) {
    const slug = name.toLowerCase()
        .replace(/æ/g, 'ae')
        .replace(/ø/g, 'oe')
        .replace(/å/g, 'aa')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

    // Check both png and jpg just in case, though we standardized on png
    const pngPath = path.join(assetsPath, subDir, `${slug}.png`);
    return fs.existsSync(pngPath);
}

// 1. Check Continents
loreData.planes.forEach(plane => {
    if (plane.continents) {
        plane.continents.forEach(cont => {
            report.continents.total++;
            // Continents are in root of assets usually or we decide a folder. 
            // Current file listing showed they are in root src/assets/
            if (!checkFile('', cont.name)) {
                report.continents.missing.push(cont.name);
            }

            // 2. Check Cities
            if (cont.regions) {
                cont.regions.forEach(reg => {
                    if (reg.cities) {
                        reg.cities.forEach(city => {
                            report.cities.total++;
                            if (!checkFile('cities', city.name)) {
                                report.cities.missing.push(city.name);
                            }
                        });
                    }
                });
            }
        });
    }
});

console.log(JSON.stringify(report, null, 2));
