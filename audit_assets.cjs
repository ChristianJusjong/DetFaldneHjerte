
const fs = require('fs');
const path = require('path');

const LORE_PATH = 'src/data/lore.json';
const ASSETS_ROOT = 'src';

// Helper to recursively search an object for keys ending in 'Image' or 'image'
function findImagePaths(obj, paths = []) {
    if (!obj || typeof obj !== 'object') return paths;

    if (Array.isArray(obj)) {
        obj.forEach(item => findImagePaths(item, paths));
        return paths;
    }

    for (const key in obj) {
        if (key.toLowerCase().includes('image') && typeof obj[key] === 'string') {
            // Only track local assets, ignore empty or external
            if (obj[key].startsWith('/') || obj[key].startsWith('assets')) {
                // Clean up path: remove leading / if present
                let cleanPath = obj[key].startsWith('/') ? obj[key].substring(1) : obj[key];
                paths.push({
                    key: key,
                    path: cleanPath,
                    context: obj.name || obj.id || 'Unknown Context'
                });
            }
        }
        // Recurse
        findImagePaths(obj[key], paths);
    }
    return paths;
}

try {
    const loreData = JSON.parse(fs.readFileSync(LORE_PATH, 'utf8'));
    const allReferences = findImagePaths(loreData);

    const uniquePaths = [...new Set(allReferences.map(r => r.path))];

    const report = {
        totalReferences: allReferences.length,
        uniqueFiles: uniquePaths.length,
        existing: [],
        missing: [],
        byCategory: {}
    };

    uniquePaths.forEach(relPath => {
        const fullPath = path.join(process.cwd(), ASSETS_ROOT, relPath);
        const exists = fs.existsSync(fullPath);

        const fileInfo = { path: relPath, exists };
        if (exists) {
            report.existing.push(fileInfo);
        } else {
            report.missing.push(fileInfo);
        }

        // Categorize
        const category = path.dirname(relPath).split(path.sep).pop() || 'root';
        if (!report.byCategory[category]) report.byCategory[category] = { total: 0, missing: 0, missingFiles: [] };

        report.byCategory[category].total++;
        if (!exists) {
            report.byCategory[category].missing++;
            report.byCategory[category].missingFiles.push(relPath);
        }
    });

    console.log("=== Image Asset Audit Report ===");
    console.log(`Total Unique Assets Referenced: ${report.uniqueFiles}`);
    console.log(`Existing: ${report.existing.length}`);
    console.log(`Missing: ${report.missing.length}`);
    console.log("\n--- Breakdown by Category ---");
    for (const cat in report.byCategory) {
        const data = report.byCategory[cat];
        console.log(`${cat}: ${data.missing}/${data.total} missing`);
        if (data.missing > 0 && data.missing < 10) {
            console.log(`  Missing: ${data.missingFiles.map(f => path.basename(f)).join(', ')}`);
        } else if (data.missing >= 10) {
            console.log(`  (Over 10 missing files, see log for details)`);
        }
    }

} catch (err) {
    console.error("Error reading lore.json:", err);
}
