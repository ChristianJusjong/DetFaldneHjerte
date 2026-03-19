const fs = require('fs');
const path = require('path');

// Helper function equivalent to src/utils/helpers.tsx
const slugify = (text) => text.toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'oe')
    .replace(/å/g, 'aa')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

const dataDir = path.join(__dirname, '../src/data/modules');

const loadJSON = (file) => JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));

const planes = loadJSON('planes.json');
const religion = loadJSON('religion.json');
const bestiary = loadJSON('bestiary.json');
const organizations = loadJSON('organizations.json');
const conflict = loadJSON('conflict.json');

const validRoutes = new Set([
    '/',
    '/races',
    '/organizations',
    '/religion',
    '/conflict',
    '/bestiary',
    '/web',
    '/timeline',
    '/map',
    '/travel',
    '/plane'
]);

const registerRoute = (route) => validRoutes.add(route);

// Index Geography
planes.forEach(p => {
    registerRoute(`/plane/${p.id}`);
    p.continents?.forEach(c => {
        registerRoute(`/continent/${c.id}`);
        c.regions?.forEach(r => {
            const regSlug = slugify(r.name);
            registerRoute(`/continent/${c.id}/${regSlug}`);
            r.cities?.forEach(city => {
                const citySlug = slugify(city.name);
                registerRoute(`/continent/${c.id}/${regSlug}/${citySlug}`);
                
                city.districts?.forEach(d => {
                    const distSlug = slugify(d.name);
                    d.assets?.forEach(a => {
                        const assetSlug = slugify(a.name);
                        registerRoute(`/continent/${c.id}/${regSlug}/${citySlug}/${distSlug}/${assetSlug}`);
                        // Also direct asset route if implemented
                        registerRoute(`/asset/${a.id || assetSlug}`);
                    });
                });
            });
        });
        
        // Races from geography
        c.races?.forEach(r => {
            registerRoute(`/lore/race/${r.id || slugify(r.name)}`);
        });
    });
});

// Index Lore Entities
religion.gods.forEach(g => registerRoute(`/lore/god/${g.id || slugify(g.name)}`));
organizations.forEach(o => registerRoute(`/lore/organization/${o.id || slugify(o.name)}`));
bestiary.forEach(b => registerRoute(`/lore/bestiary/${b.id || slugify(b.name)}`));
conflict.fractions.forEach(f => registerRoute(`/lore/conflict/${f.id || slugify(f.name)}`));

console.log(`Indexed ${validRoutes.size} valid routes.`);

// Link Collection
const brokenLinks = [];

const checkLink = (link, context) => {
    if (!link.startsWith('/')) return; // External or relative to current page (not handled yet)
    if (!validRoutes.has(link)) {
        brokenLinks.push({ link, context });
    }
};

// Check SmartLinks in descriptions
const termRegex = /\[([^\]]+)\]/g; // Hypothetical manual link [Label](url) or just text to be smart-linked

// Since we know SmartLink uses terms, let's check all terms from smartTextEngine
const termsToPages = new Map();
// (This is a simplified version of smartTextEngine indexing)
planes.forEach(p => termsToPages.set(p.name, `/plane/${p.id}`));
planes.forEach(p => p.continents?.forEach(c => {
    termsToPages.set(c.name, `/continent/${c.id}`);
    c.regions?.forEach(r => termsToPages.set(r.name, `/continent/${c.id}/${slugify(r.name)}`));
    c.regions?.forEach(r => r.cities?.forEach(city => termsToPages.set(city.name, `/continent/${c.id}/${slugify(r.name)}/${slugify(city.name)}`)));
    c.races?.forEach(r => termsToPages.set(r.name, `/lore/race/${r.id || slugify(r.name)}`));
}));
religion.gods.forEach(g => termsToPages.set(g.name.split(' (')[0], `/lore/god/${g.id || slugify(g.name)}`));
organizations.forEach(o => termsToPages.set(o.name, `/lore/organization/${o.id || slugify(o.name)}`));
bestiary.forEach(b => termsToPages.set(b.name, `/lore/bestiary/${b.id || slugify(b.name)}`));

console.log(`Total smart terms indexed: ${termsToPages.size}`);

// Verify all smart term targets exist in validRoutes
termsToPages.forEach((url, term) => {
    if (!validRoutes.has(url)) {
        brokenLinks.push({ link: url, context: `Smart Term: ${term}` });
    }
});

if (brokenLinks.length > 0) {
    console.error(`\nFound ${brokenLinks.length} broken links:`);
    brokenLinks.forEach(bl => console.error(`- ${bl.link} (${bl.context})`));
    process.exit(1);
} else {
    console.log('\nAll indexed links are valid according to the routing structure!');
    process.exit(0);
}
