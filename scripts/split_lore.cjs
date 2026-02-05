const fs = require('fs');
const path = require('path');

const LORE_PATH = path.join(__dirname, '../src/data/lore.json');
const MODULES_DIR = path.join(__dirname, '../src/data/modules');

if (!fs.existsSync(MODULES_DIR)) {
    fs.mkdirSync(MODULES_DIR, { recursive: true });
}

const lore = JSON.parse(fs.readFileSync(LORE_PATH, 'utf8'));

// 1. Meta
const meta = {
    worldName: lore.worldName,
    description: lore.description
};
fs.writeFileSync(path.join(MODULES_DIR, 'meta.json'), JSON.stringify(meta, null, 2));

// 2. Planes
fs.writeFileSync(path.join(MODULES_DIR, 'planes.json'), JSON.stringify(lore.planes || [], null, 2));

// 3. Religion
fs.writeFileSync(path.join(MODULES_DIR, 'religion.json'), JSON.stringify(lore.religion || {}, null, 2));

// 4. Bestiary
fs.writeFileSync(path.join(MODULES_DIR, 'bestiary.json'), JSON.stringify(lore.bestiary || [], null, 2));

// 5. Organizations
fs.writeFileSync(path.join(MODULES_DIR, 'organizations.json'), JSON.stringify(lore.organizations || [], null, 2));

// 6. Conflict
fs.writeFileSync(path.join(MODULES_DIR, 'conflict.json'), JSON.stringify(lore.conflict || {}, null, 2));

// 7. Travel
fs.writeFileSync(path.join(MODULES_DIR, 'travel.json'), JSON.stringify(lore.travel || [], null, 2));

console.log('Lore split complete.');
