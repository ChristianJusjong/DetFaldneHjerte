const fs = require('fs');
const path = require('path');

const LORE_PATH = path.join(__dirname, '../src/data/lore.json');
const BACKUP_PATH = path.join(__dirname, '../src/data/lore.backup.json');

try {
    const lore = JSON.parse(fs.readFileSync(LORE_PATH, 'utf8'));

    // Create backup
    fs.writeFileSync(BACKUP_PATH, JSON.stringify(lore, null, 2));
    console.log(`Backup created at ${BACKUP_PATH}`);

    const plane = lore.planes[0]; // Assuming Lys-Siden is index 0
    if (!plane) {
        throw new Error("No planes found in lore.json");
    }

    let modified = false;
    const entitiesToMove = ['religion', 'organizations', 'bestiary', 'travel', 'conflict', 'history', 'conflicts'];

    entitiesToMove.forEach(key => {
        if (plane[key]) {
            console.log(`Moving '${key}' from plane[0] to root...`);
            lore[key] = plane[key];
            delete plane[key];
            modified = true;
        } else {
            console.log(`Key '${key}' not found in plane[0]. Checking root...`);
            if (lore[key]) {
                console.log(`Key '${key}' already exists at root.`);
            }
        }
    });

    if (modified) {
        fs.writeFileSync(LORE_PATH, JSON.stringify(lore, null, 2));
        console.log("Lore structure successfully updated!");
    } else {
        console.log("No changes needed.");
    }

} catch (err) {
    console.error("Migration failed:", err);
}
