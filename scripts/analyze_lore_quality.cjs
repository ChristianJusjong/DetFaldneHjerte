const fs = require('fs');
const path = require('path');

const lorePath = path.join(__dirname, '../src/data/lore.json');
const loreData = JSON.parse(fs.readFileSync(lorePath, 'utf8'));

const report = {
    structure: {
        emptyContinents: [],
        emptyRegions: [],
        emptyCities: [],
        emptyDistricts: []
    },
    missingContent: {
        images: [],
        descriptions: [],
        inventories: [], // Shops without items
        npcStats: []      // Should be 0 now
    },
    stats: {
        totalImagesMissing: 0,
        totalDescWeak: 0
    }
};

function checkQuality(type, name, desc, image, context) {
    if (!desc || desc.length < 30 || desc.includes("Generic")) {
        report.missingContent.descriptions.push(`[${type}] ${name} (${context})`);
        report.stats.totalDescWeak++;
    }
    if (!image) {
        report.missingContent.images.push(`[${type}] ${name} (${context})`);
        report.stats.totalImagesMissing++;
    }
}

// 1. Geography & Assets Correlation
loreData.planes.forEach(plane => {
    if (!plane.continents || plane.continents.length === 0) report.structure.emptyContinents.push(plane.name);
    else plane.continents.forEach(cont => {
        checkQuality('Continent', cont.name, cont.description, null, plane.name); // Continents might not have single image yet

        if (!cont.regions || cont.regions.length === 0) report.structure.emptyRegions.push(cont.name);
        else cont.regions.forEach(reg => {
            // checkQuality('Region', reg.name, reg.desc, null, cont.name); 

            if (!reg.cities || reg.cities.length === 0) report.structure.emptyCities.push(reg.name);
            else reg.cities.forEach(city => {
                checkQuality('City', city.name, city.desc, city.image || city.mapImage, reg.name);

                if (!city.districts || city.districts.length === 0) report.structure.emptyDistricts.push(city.name);
                else city.districts.forEach(dist => {
                    checkQuality('District', dist.name, dist.desc, dist.image, city.name);

                    if (dist.assets) dist.assets.forEach(asset => {
                        checkQuality('Asset', asset.name, asset.desc, asset.image, dist.name);

                        // Shop Logic
                        if (asset.type === 'shop' && (!asset.inventory || asset.inventory.length === 0)) {
                            report.missingContent.inventories.push(`${asset.name} in ${city.name}`);
                        }

                        // NPC Logic
                        if ((asset.type === 'npc' || asset.type === 'guard') && !asset.stats) {
                            report.missingContent.npcStats.push(`${asset.name} in ${city.name}`);
                        }
                    });
                });
            });
        });
    });
});

// 2. Root Entities
const rootEntities = ['gods', 'organizations', 'bestiary']; // Inside respective keys
if (loreData.religion && loreData.religion.gods) {
    loreData.religion.gods.forEach(g => checkQuality('God', g.name, g.desc, g.image, 'Religion'));
}
if (loreData.organizations) {
    loreData.organizations.forEach(o => checkQuality('Organization', o.name, o.desc, o.image, 'Factions'));
}
if (loreData.bestiary) {
    loreData.bestiary.forEach(b => checkQuality('Bestiary', b.name, b.desc, b.image, 'Monsters'));
}

console.log(JSON.stringify(report, null, 2));
