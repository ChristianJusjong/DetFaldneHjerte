const fs = require('fs');
const path = require('path');

// Hardcoded for this session based on your metadata
const ARTIFACT_DIR = 'C:/Users/christian.jusjong/.gemini/antigravity/brain/be021a0e-6840-4249-8ac8-88b32cd4e241';
const PUBLIC_DIR = path.join(__dirname, '../public/images/generated');
const LORE_PATH = path.join(__dirname, '../src/data/lore.json');
const PROMPTS_PATH = path.join(__dirname, '../src/data/image_prompts.json');

if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

const lore = JSON.parse(fs.readFileSync(LORE_PATH, 'utf8'));
const prompts = JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf8'));
const files = fs.readdirSync(ARTIFACT_DIR).filter(f => f.endsWith('.png'));

let updates = 0;

function findEntity(id, name, type) {
    let found = null;

    // Helper to check match
    const isMatch = (e) => {
        // Match by strict ID if exists, or slugified name
        const eId = e.id || e.name.toLowerCase().replace(/\s+/g, '-');
        return eId === id || e.name === name;
    };

    // 1. Root
    if (lore.religion && lore.religion.gods) {
        const m = lore.religion.gods.find(isMatch);
        if (m) return m;
    }
    if (lore.bestiary) {
        const m = lore.bestiary.find(isMatch);
        if (m) return m;
    }
    if (lore.organizations) {
        const m = lore.organizations.find(isMatch);
        if (m) return m;
    }
    if (lore.conflict && lore.conflict.fractions) {
        const m = lore.conflict.fractions.find(isMatch);
        if (m) return m;
    }

    // 2. Geography
    lore.planes.forEach(p => {
        if (p.continents) p.continents.forEach(c => {
            if (c.regions) c.regions.forEach(r => {
                if (r.cities) r.cities.forEach(city => {
                    if (city.districts) city.districts.forEach(d => {
                        if (isMatch(d)) found = d;
                        if (d.assets) {
                            const a = d.assets.find(isMatch);
                            if (a) found = a;
                        }
                    });
                });
            });
        });
    });

    return found;
}

prompts.forEach(p => {
    // The tool calls used underscores for names roughly matching the ID
    // ID: "arkitekten-orden" -> look for "arkitekten_orden"
    const prefix = p.id.replace(/-/g, '_');

    // Find matching files
    const matches = files.filter(f => f.startsWith(prefix));
    if (matches.length === 0) return;

    // Pick latest
    const match = matches.sort().pop();

    // Process
    const destName = `${p.id}.png`;
    const destPath = path.join(PUBLIC_DIR, destName);

    // Only copy if size differs or dest doesn't exist (basic sync)
    // Actually just overwrite to be safe with latest gen
    try {
        fs.copyFileSync(path.join(ARTIFACT_DIR, match), destPath);

        // Update Lore
        const entity = findEntity(p.id, p.name, p.type);
        if (entity) {
            const webPath = `/images/generated/${destName}`;
            if (entity.image !== webPath) {
                entity.image = webPath;
                console.log(`[LINKED] ${p.name} -> ${webPath}`);
                updates++;
            }
        } else {
            console.log(`[WARN] Could not find entity for prompt: ${p.name}`);
        }
    } catch (e) {
        console.error(`Error processing ${match}: ${e.message}`);
    }
});

if (updates > 0) {
    fs.writeFileSync(LORE_PATH, JSON.stringify(lore, null, 2));
    console.log(`Updated lore.json with ${updates} new images.`);
} else {
    console.log("No new images linked.");
}
