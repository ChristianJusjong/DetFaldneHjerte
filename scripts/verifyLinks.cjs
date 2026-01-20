const fs = require('fs');
const path = require('path');

// Helper to slugify (must match src/utils/helpers.tsx)
const slugify = (text) => text.toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'oe')
    .replace(/å/g, 'aa')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

// Load Data
const lorePath = path.join(__dirname, '../src/data/lore.json');
const lore = JSON.parse(fs.readFileSync(lorePath, 'utf8'));

// 1. Build Registry of Valid Links (Simulate SmartLink.tsx)
const terms = [];
const VALID_URLS = new Set();

// Add and register term
const register = (term, url, type, context) => {
    if (!term) return;
    terms.push({ term, url, type, context });
    VALID_URLS.add(url);
};

console.log('--- Building Link Registry ---');

// Continents & Regions & Cities
lore.planes.forEach(p => {
    p.continents.forEach(c => {
        register(c.name, `/continent/${c.id}`, 'continent', `Continent: ${c.name}`);

        c.regions.forEach(r => {
            const rUrl = `/continent/${c.id}/${slugify(r.name)}`;
            register(r.name, rUrl, 'region', `Region: ${r.name}`);

            r.cities.forEach(city => {
                const cUrl = `/continent/${c.id}/${slugify(r.name)}/${slugify(city.name)}`;
                register(city.name, cUrl, 'city', `City: ${city.name}`);
            });
        });

        c.races.forEach(race => {
            register(race.name, `/races#${slugify(race.name)}`, 'race', `Race: ${race.name}`);
        });
    });
});

// Gods
lore.religion.gods.forEach(g => {
    const name = g.name.split(' (')[0];
    register(name, `/religion#${slugify(g.name)}`, 'god', `God: ${name}`);
});

// Organizations
if (lore.organizations) {
    lore.organizations.forEach(o => {
        register(o.name, `/organizations#${slugify(o.name)}`, 'organization', `Org: ${o.name}`);
    });
}

// Sort terms by length desc (longest match first)
terms.sort((a, b) => b.term.length - a.term.length);

console.log(`Registered ${terms.length} terms.`);

// DEBUG: Find "Ly"
const lyTerms = terms.filter(t => t.term.startsWith('Ly'));
console.log('--- DEBUG: Terms starting with "Ly" ---');
lyTerms.forEach(t => console.log(`Term: "${t.term}", URL: ${t.url}, Type: ${t.type}`));
console.log('---------------------------------------');

// 2. Scan All Text Fields
const issues = [];
const warnings = [];

const scanText = (text, location) => {
    if (!text) return;

    // Check for hardcoded Markdown links [Text](url)
    const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = mdLinkRegex.exec(text)) !== null) {
        const [full, label, url] = match;
        if (!url.startsWith('/') && !url.startsWith('http')) {
            warnings.push(`[${location}] Relative/Invalid link found: ${full}`);
        }
    }
};

const traverse = (obj, path = '') => {
    if (!obj) return;
    if (typeof obj === 'string') {
        scanText(obj, path);
    } else if (Array.isArray(obj)) {
        obj.forEach((item, i) => traverse(item, `${path}[${i}]`));
    } else if (typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
            if (key === 'image' || key === 'id' || key === 'color') return; // Skip non-text
            traverse(obj[key], `${path}.${key}`);
        });
    }
};

console.log('--- Scanning Content ---');
traverse(lore, 'lore');

// 3. Output Results
console.log('--- Analysis Complete ---');
if (warnings.length > 0) {
    console.log('\nWarnings (Potential Issues):');
    warnings.forEach(w => console.log(w));
} else {
    console.log('\nNo broken hardcoded links found.');
}

// 5. Check for Potential Unlinked Terms (Capitalized phrases not in registry)
const potentialMisses = new Map();
const IGNORE_WORDS = new Set(['De', 'Det', 'En', 'Et', 'Jeg', 'Du', 'Han', 'Hun', 'Vi', 'I', 'Man', 'Men', 'Og', 'Eller', 'Hvis', 'Hvad', 'Hvor', 'Her', 'Der', 'Fra', 'Til', 'Med', 'Af', 'For', 'Om', 'Også', 'Kun', 'Den', 'Denne', 'Dette', 'Disse', 'Min', 'Din', 'Hans', 'Hendes', 'Vores', 'Jeres', 'Deres', 'Som', 'Derfor', 'Fordi', 'Selv', 'Hele', 'Alle', 'Mange', 'Nogle', 'Ingen', 'Alt', 'Intet', 'Nu', 'Før', 'Siden', 'Snart', 'Stadig', 'Igen', 'Måske', 'Næsten', 'Ofte', 'Altid', 'Aldrig', 'Ja', 'Nej', 'Tak']);

const scanForMisses = (text, location) => {
    if (!text) return;
    // Regex for "Word" or "Word Word"
    const capitalizedRegex = /\b[A-ZÆØÅ][a-zæøå]+\b/g;
    let match;
    while ((match = capitalizedRegex.exec(text)) !== null) {
        const word = match[0];
        if (IGNORE_WORDS.has(word)) continue;

        // Simulating SmartLink's new boundary check: \bTerm\b
        // EXACT match checking (case insensitive)
        const isTerm = terms.some(t => t.term.toLowerCase() === word.toLowerCase());
        if (!isTerm) {
            const count = potentialMisses.get(word) || 0;
            potentialMisses.set(word, count + 1);
        }
    }
}

console.log('--- Scanning for Missed Links ---');
traverse(lore, 'lore');

// Only print high frequency misses
console.log('--- Potential Unlinked Entities (Freq > 2) ---');
potentialMisses.forEach((count, word) => {
    if (count > 2) {
        console.log(`${word} (${count})`);
    }
});
