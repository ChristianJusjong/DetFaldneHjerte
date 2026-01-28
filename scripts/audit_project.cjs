const fs = require('fs');
const path = require('path');

const LORE_PATH = 'src/data/lore.json';
// We check both likely locations for assets
const SEARCH_ROOTS = ['public', 'src'];

function resolveAssetPath(webPath) {
    // webPath comes in like "/assets/items/foo.png"
    const relPath = webPath.startsWith('/') ? webPath.substring(1) : webPath;

    for (const root of SEARCH_ROOTS) {
        const fullPath = path.join(process.cwd(), root, relPath);
        if (fs.existsSync(fullPath)) {
            return { found: true, path: fullPath, root };
        }
    }
    return { found: false, tried: SEARCH_ROOTS.map(r => path.join(r, relPath)) };
}

function traverse(obj, pathStack = [], report) {
    if (!obj || typeof obj !== 'object') return;

    // Check for description presence on named things
    // We treat something as an "Entity" worth checking if it has a 'name' or 'id'
    // AND it's not just a reference string.
    if (!Array.isArray(obj) && (obj.name || obj.id)) {
        const hasDesc = obj.desc || obj.description || (obj.manual && obj.manual.desc);
        if (!hasDesc) {
            // Filter out things that might not need descriptions (like simple inventory lists if they are simple strings, 
            // but here usually items are objects).
            // We'll report it.
            report.missingDescriptions.push({
                name: obj.name || obj.id,
                path: pathStack.join(' > ')
            });
        }
    }

    // Check properties
    for (const key in obj) {
        const value = obj[key];
        const newPathStack = [...pathStack, key];

        // Image Check
        if (key.toLowerCase().includes('image') && typeof value === 'string') {
            if (value.trim() === '') {
                report.emptyImageFields.push({
                    name: obj.name || obj.id || 'Unknown',
                    field: key,
                    path: pathStack.join(' > ')
                });
            } else {
                const status = resolveAssetPath(value);
                if (!status.found) {
                    report.missingImages.push({
                        name: obj.name || obj.id || 'Unknown',
                        field: key,
                        value: value,
                        path: pathStack.join(' > ')
                    });
                }
            }
        }

        // Recurse
        if (typeof value === 'object') {
            // If it's an array, push index to stack
            if (Array.isArray(value)) {
                value.forEach((item, idx) => {
                    traverse(item, [...newPathStack, `[${idx}]`], report);
                });
            } else {
                traverse(value, newPathStack, report);
            }
        }
    }
}

try {
    const loreData = JSON.parse(fs.readFileSync(LORE_PATH, 'utf8'));
    const report = {
        missingImages: [],
        emptyImageFields: [],
        missingDescriptions: []
    };

    traverse(loreData, ['root'], report);

    console.log("=== PROJECT ASSET AUDIT ===");

    if (report.missingImages.length > 0) {
        console.log(`\nMISSING OR BROKEN IMAGE LINKS (${report.missingImages.length}):`);
        report.missingImages.forEach(item => {
            console.log(`- [${item.name}] ${item.field}: "${item.value}" (at ${item.path})`);
        });
    } else {
        console.log("\nNo missing images found.");
    }

    if (report.emptyImageFields.length > 0) {
        console.log(`\nEMPTY IMAGE FIELDS (${report.emptyImageFields.length}):`);
        report.emptyImageFields.forEach(item => {
            console.log(`- [${item.name}] ${item.field} is empty (at ${item.path})`);
        });
    }

    if (report.missingDescriptions.length > 0) {
        console.log(`\nMISSING DESCRIPTIONS (${report.missingDescriptions.length}):`);
        // Limit output if too many
        const showCount = 50;
        report.missingDescriptions.slice(0, showCount).forEach(item => {
            console.log(`- [${item.name}] at ${item.path}`);
        });
        if (report.missingDescriptions.length > showCount) {
            console.log(`... and ${report.missingDescriptions.length - showCount} more.`);
        }
    } else {
        console.log("\nNo missing descriptions found.");
    }

} catch (err) {
    console.error("Error:", err);
}
