const fs = require('fs');
const path = require('path');

const lorePath = path.join(__dirname, '../src/data/lore.json');
const loreData = JSON.parse(fs.readFileSync(lorePath, 'utf8'));

// Helper to slugify
const slugify = (text) => text.toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'oe')
    .replace(/å/g, 'aa')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

// 1. Update Continents
loreData.planes.forEach(plane => {
    if (plane.continents) {
        plane.continents.forEach(cont => {
            const slug = slugify(cont.name);
            // Ensure standard path, even if it might differ slightly now (e.g. tanketinderne.png)
            // We'll standardize on /assets/maps/continents/[slug].png eventually, 
            // but for now let's keep existing structure if valid, or default to new.
            // Actually, existing are in root, but let's point to where they SHOULD be.
            // Actually, let's look at coverage. Existing maps are at /assets/slug.png (no subfolder).
            // Let's migrate to /assets/maps/continents/ for organization if we are regenerating.

            // For this task, we focus on CITIES as the critical gap.
            if (cont.regions) {
                cont.regions.forEach(reg => {
                    if (reg.cities) {
                        reg.cities.forEach(city => {
                            const citySlug = slugify(city.name);
                            // Set the target path for the future generated map
                            city.mapImage = `/assets/maps/cities/${citySlug}.png`;

                            // If city doesn't have a scenic image, use a placeholder or same logic
                            if (!city.image) {
                                // city.image = `/assets/scenic/cities/${citySlug}.png`; 
                                // Commented out to not break fallback logic if file missing
                            }
                        });
                    }
                });
            }
        });
    }
});

fs.writeFileSync(lorePath, JSON.stringify(loreData, null, 2), 'utf8');
console.log('Lore updated with standardized map paths.');
