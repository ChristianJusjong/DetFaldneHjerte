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

// Update Organizations
if (loreData.organizations) {
    loreData.organizations.forEach(org => {
        const slug = slugify(org.name);
        org.image = `/assets/organizations/${slug}.png`;

        // Add visual summary if missing (enrichment)
        if (!org.visualSummary) {
            org.visualSummary = `Symbol or headquarters of ${org.name}. Description: ${org.description}`;
        }
    });
}

fs.writeFileSync(lorePath, JSON.stringify(loreData, null, 2), 'utf8');
console.log('Lore updated with standardized organization image paths.');
