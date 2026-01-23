const fs = require('fs');
const path = require('path');
// Mock slugify since we can't easily import from TSX in CJS without compilation
function simpleSlugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

const lorePath = path.join(__dirname, '../src/data/lore.json');
const rawData = fs.readFileSync(lorePath, 'utf8');
const data = JSON.parse(rawData);

/* 
  Migration Logic:
  1. Traverse to Cities.
  2. Create a "Centrum" district for each city.
  3. Move `shops` and `inhabitants` into this district as `assets`.
  4. Map old fields to new Asset fields.
*/

function migrateAsset(item, type) {
    const asset = {
        id: simpleSlugify(item.name || 'unknown'),
        name: item.name,
        type: type,
        desc: item.desc,
        // Preserve old fields if they exist
        ...(item.owner && { owner: item.owner }),
        ...(item.role && { role: item.role }),
        ...(item.wants && { wants: item.wants }),
        ...(item.image && { image: item.image })
    };

    if (type === 'shop') {
        asset.subtype = item.type; // Old "type" was like "Blacksmith", new type is "shop"
    }

    return asset;
}

data.planes.forEach(plane => {
    plane.continents.forEach(continent => {
        continent.regions.forEach(region => {
            region.cities.forEach(city => {
                // Create default district
                const defaultDistrict = {
                    id: 'centrum',
                    name: 'Centrum',
                    desc: 'Byens hjerte.',
                    assets: []
                };

                // Migrate Shops
                if (city.shops) {
                    city.shops.forEach(shop => {
                        defaultDistrict.assets.push(migrateAsset(shop, 'shop'));
                    });
                    delete city.shops; // Remove old field
                }

                // Migrate Inhabitants
                if (city.inhabitants) {
                    city.inhabitants.forEach(npc => {
                        defaultDistrict.assets.push(migrateAsset(npc, 'npc'));
                    });
                    delete city.inhabitants; // Remove old field
                }

                city.districts = [defaultDistrict];
            });
        });
    });
});

fs.writeFileSync(lorePath, JSON.stringify(data, null, 2));
console.log('Migration complete: lore.json updated.');
