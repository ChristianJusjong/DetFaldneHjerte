const fs = require('fs');
const path = require('path');


function simpleSlugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

const LORE_PATH = path.join(__dirname, '../src/data/lore.json');

try {
    const lore = JSON.parse(fs.readFileSync(LORE_PATH, 'utf8'));
    let changes = 0;

    // Fix Ankeret (Plane 0 -> Tanke-Tinderne? No, Ankeret is in... let's find it)
    function findCity(name) {
        for (let p of lore.planes) {
            if (p.continents) for (let c of p.continents) {
                if (c.regions) for (let r of c.regions) {
                    if (r.cities) for (let city of r.cities) {
                        if (city.name === name) return city;
                    }
                }
            }
        }
        return null;
    }

    const ankeret = findCity("Ankeret");
    if (ankeret) {
        ankeret.districts.forEach(dist => {
            // Check if malformed (has "districts" property)
            if (dist.districts) {
                console.log(`Fixing malformed district: ${dist.name} in Ankeret`);

                // Move assets up
                if (dist.districts[0] && dist.districts[0].assets) {
                    dist.assets = dist.districts[0].assets;
                } else {
                    dist.assets = [];
                }

                // Set ID if missing
                if (!dist.id) dist.id = simpleSlugify(dist.name);

                // Clean up
                delete dist.districts;
                delete dist.layout;
                delete dist.capital; // If any
                changes++;
            }
        });
    } else {
        console.log("Ankeret not found!");
    }

    // Fix Bitter-Sumpen Region issues
    // We need to find the region "Bitter-Sumpen"
    let bitterSumpenRegion = null;
    for (let p of lore.planes) {
        if (p.continents) for (let c of p.continents) {
            if (c.regions) for (let r of c.regions) {
                if (r.name === "Bitter-Sumpen") bitterSumpenRegion = r;
            }
        }
    }

    if (bitterSumpenRegion) {
        // Check for malformed cities
        // Analysis said "City: Bitter-Sumpen" has no districts.
        // This implies there is a city named "Bitter-Sumpen" inside the region "Bitter-Sumpen".
        const selfNamedCityIndex = bitterSumpenRegion.cities.findIndex(c => c.name === "Bitter-Sumpen");
        if (selfNamedCityIndex !== -1) {
            console.log("Removing duplicate 'Bitter-Sumpen' city entry inside region.");
            bitterSumpenRegion.cities.splice(selfNamedCityIndex, 1);
            changes++;
        }
    }

    if (changes > 0) {
        fs.writeFileSync(LORE_PATH, JSON.stringify(lore, null, 2));
        console.log(`Fixed ${changes} issues.`);
    } else {
        console.log("No issues found to fix.");
    }

} catch (err) {
    console.error("Fix script failed:", err);
}
