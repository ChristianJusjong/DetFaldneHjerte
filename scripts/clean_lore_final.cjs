const fs = require('fs');
const path = require('path');

const LORE_PATH = path.join(__dirname, '../src/data/lore.json');

try {
    const lore = JSON.parse(fs.readFileSync(LORE_PATH, 'utf8'));
    let changes = 0;

    lore.planes.forEach(p => {
        if (p.continents) p.continents.forEach(c => {
            if (c.regions) c.regions.forEach(r => {
                if (r.cities) {
                    const originalLength = r.cities.length;
                    // Filter out nameless cities and the specific invalid Bitter-Sumpen city
                    r.cities = r.cities.filter(city => {
                        const hasName = !!city.name;
                        const isInvalidBS = city.name === "Bitter-Sumpen" && !city.districts;

                        if (!hasName) return false;
                        if (isInvalidBS) return false;
                        return true;
                    });

                    if (r.cities.length !== originalLength) {
                        console.log(`Cleaned ${originalLength - r.cities.length} invalid cities from ${r.name}`);
                        changes += (originalLength - r.cities.length);
                    }
                }
            });
        });
    });

    if (changes > 0) {
        fs.writeFileSync(LORE_PATH, JSON.stringify(lore, null, 2));
        console.log(`Successfully removed ${changes} invalid entries.`);
    } else {
        console.log("No invalid entries found.");
    }

} catch (err) {
    console.error("Cleanup failed:", err);
}
