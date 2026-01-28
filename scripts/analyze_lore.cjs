const fs = require('fs');
const path = require('path');

const LORE_PATH = path.join(__dirname, '../src/data/lore.json');

try {
    const lore = JSON.parse(fs.readFileSync(LORE_PATH, 'utf8'));

    const stats = {
        planes: 0,
        continents: 0,
        regions: 0,
        cities: 0,
        districts: 0,
        assets: {
            total: 0,
            shop: 0,
            npc: 0,
            guard: 0,
            location: 0,
            landmark: 0,
            other: 0
        },
        entities: {
            gods: 0,
            races: 0,
            organizations: 0,
            factions: 0,
            bestiary: 0
        },
        issues: []
    };

    function logIssue(location, message) {
        stats.issues.push(`[${location}] ${message}`);
    }

    // --- Geographic Analysis ---
    if (lore.planes) {
        stats.planes = lore.planes.length;
        lore.planes.forEach(plane => {
            if (!plane.id) logIssue(`Plane: ${plane.name}`, 'Missing ID');

            // Continents
            if (plane.continents) {
                stats.continents += plane.continents.length;
                plane.continents.forEach(cont => {
                    if (!cont.id) logIssue(`Continent: ${cont.name}`, 'Missing ID');

                    // Regions
                    if (cont.regions) {
                        stats.regions += cont.regions.length;
                        cont.regions.forEach(reg => {
                            // Cities
                            if (reg.cities) {
                                stats.cities += reg.cities.length;
                                reg.cities.forEach(city => {
                                    if (!city.districts) logIssue(`City: ${city.name}`, 'No districts defined');

                                    // Districts
                                    if (city.districts) {
                                        stats.districts += city.districts.length;
                                        city.districts.forEach(dist => {
                                            if (!dist.id) logIssue(`District: ${dist.name} in ${city.name}`, 'Missing ID');

                                            // Assets
                                            if (dist.assets) {
                                                stats.assets.total += dist.assets.length;
                                                dist.assets.forEach(asset => {
                                                    if (!asset.id) logIssue(`Asset: ${asset.name} in ${city.name}`, 'Missing ID');

                                                    // Type Counting
                                                    if (stats.assets[asset.type] !== undefined) {
                                                        stats.assets[asset.type]++;
                                                    } else {
                                                        stats.assets.other++;
                                                    }

                                                    // Quality Checks
                                                    if (asset.type === 'shop') {
                                                        if (!asset.inventory || asset.inventory.length === 0) {
                                                            logIssue(`Shop: ${asset.name}`, 'Empty or missing inventory');
                                                        }
                                                        if (!asset.owner && !asset.shopkeeper) {
                                                            logIssue(`Shop: ${asset.name}`, 'Missing owner/shopkeeper info');
                                                        }
                                                    }
                                                    if (asset.type === 'npc') {
                                                        if (!asset.stats) {
                                                            logIssue(`NPC: ${asset.name}`, 'Missing stats');
                                                        }
                                                        if (!asset.role) {
                                                            logIssue(`NPC: ${asset.name}`, 'Missing role');
                                                        }
                                                    }
                                                });
                                            } else {
                                                logIssue(`District: ${dist.name}`, 'No assets array');
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    // --- Entity Analysis ---
    if (lore.religion && lore.religion.gods) {
        stats.entities.gods = lore.religion.gods.length;
        lore.religion.gods.forEach(g => {
            if (!g.id) logIssue(`God: ${g.name}`, 'Missing ID');
        });
    }

    if (lore.planes && lore.planes[0] && lore.planes[0].continents) {
        // Assuming races are on the first continent for now or global. 
        // Actually structure says lore.planes[].continents[].races
        // Let's count them all
        lore.planes.forEach(p => p.continents?.forEach(c => {
            if (c.races) {
                stats.entities.races += c.races.length;
                c.races.forEach(r => {
                    if (!r.id) logIssue(`Race: ${r.name}`, 'Missing ID');
                });
            }
        }));
    }

    if (lore.organizations) {
        stats.entities.organizations = lore.organizations.length;
        lore.organizations.forEach(o => {
            if (!o.id) logIssue(`Org: ${o.name}`, 'Missing ID');
        });
    }

    if (lore.conflict && lore.conflict.fractions) {
        stats.entities.factions = lore.conflict.fractions.length;
        lore.conflict.fractions.forEach(f => {
            if (!f.id) logIssue(`Faction: ${f.name}`, 'Missing ID');
        });
    }

    if (lore.bestiary) {
        stats.entities.bestiary = lore.bestiary.length;
        lore.bestiary.forEach(b => {
            if (!b.id) logIssue(`Beast: ${b.name}`, 'Missing ID');
        });
    }


    // --- Output Report ---
    console.log('--- ANALYSIS REPORT ---');
    console.log('\nGEOGRAPHY:');
    console.log(`Planes: ${stats.planes}`);
    console.log(`Continents: ${stats.continents}`);
    console.log(`Regions: ${stats.regions}`);
    console.log(`Cities: ${stats.cities}`);
    console.log(`Districts: ${stats.districts}`);

    console.log('\nASSETS:');
    console.log(`Total Assets: ${stats.assets.total}`);
    console.log(`- Shops: ${stats.assets.shop}`);
    console.log(`- NPCs: ${stats.assets.npc}`);
    console.log(`- Guards: ${stats.assets.guard}`);
    console.log(`- Locations: ${stats.assets.location}`);
    console.log(`- Landmarks: ${stats.assets.landmark}`);

    console.log('\nENTITIES:');
    console.log(`Gods: ${stats.entities.gods}`);
    console.log(`Races: ${stats.entities.races}`);
    console.log(`Organizations: ${stats.entities.organizations}`);
    console.log(`Factions: ${stats.entities.factions}`);
    console.log(`Bestiary: ${stats.entities.bestiary}`);

    console.log('\nISSUES FOUND (' + stats.issues.length + '):');
    if (stats.issues.length > 0) {
        stats.issues.slice(0, 20).forEach(i => console.log(i));
        if (stats.issues.length > 20) console.log(`... and ${stats.issues.length - 20} more.`);
    } else {
        console.log('None! Data integrity looks good.');
    }

} catch (err) {
    console.error('Failed to analyze lore:', err);
}
