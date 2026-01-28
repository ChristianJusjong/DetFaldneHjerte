const fs = require('fs');
const path = require('path');

const LORE_PATH = path.join(__dirname, '../src/data/lore.json');

try {
    const lore = JSON.parse(fs.readFileSync(LORE_PATH, 'utf8'));
    let updatedCount = 0;

    // Stat archetypes
    const archetypes = {
        guard: { str: 16, dex: 12, con: 14, int: 10, wis: 12, cha: 10 },
        mage: { str: 8, dex: 12, con: 12, int: 16, wis: 14, cha: 10 },
        rogue: { str: 10, dex: 16, con: 12, int: 12, wis: 10, cha: 14 },
        merchant: { str: 10, dex: 10, con: 10, int: 13, wis: 14, cha: 16 },
        commoner: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }
    };

    function getStats(role) {
        const r = (role || "").toLowerCase();
        if (r.includes('vagt') || r.includes('soldat') || r.includes('kriger') || r.includes('ridder')) return archetypes.guard;
        if (r.includes('magi') || r.includes('vismand') || r.includes('præst') || r.includes('artificer') || r.includes('alkymist')) return archetypes.mage;
        if (r.includes('tyv') || r.includes('spejder') || r.includes('jæger') || r.includes('dykker') || r.includes('samler')) return archetypes.rogue;
        if (r.includes('handler') || r.includes('købmand') || r.includes('ejer') || r.includes('sælger')) return archetypes.merchant;
        return archetypes.commoner;
    }

    // Traverse logic (similar to populate_shops)
    lore.planes.forEach(plane => {
        if (!plane.continents) return;
        plane.continents.forEach(cont => {
            if (!cont.regions) return;
            cont.regions.forEach(reg => {
                if (!reg.cities) return;
                reg.cities.forEach(city => {
                    if (!city.districts) return;
                    city.districts.forEach(dist => {
                        if (!dist.assets) return;
                        dist.assets.forEach(asset => {
                            if (asset.type === 'npc' || asset.type === 'guard') {
                                if (!asset.stats) {
                                    console.log(`Generating stats for ${asset.name} (${asset.role || 'Unknown'})...`);
                                    // Clone to avoid reference issues
                                    asset.stats = { ...getStats(asset.role) };

                                    // Add some variance
                                    Object.keys(asset.stats).forEach(k => {
                                        asset.stats[k] += Math.floor(Math.random() * 3) - 1; // -1 to +1 variance
                                    });
                                    updatedCount++;
                                }
                            }
                        });
                    });
                });
            });
        });
    });

    if (updatedCount > 0) {
        fs.writeFileSync(LORE_PATH, JSON.stringify(lore, null, 2));
        console.log(`Successfully backfilled stats for ${updatedCount} NPCs.`);
    } else {
        console.log("No NPCs needed stats update.");
    }

} catch (err) {
    console.error("Backfill failed:", err);
}
