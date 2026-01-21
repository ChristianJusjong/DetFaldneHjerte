const fs = require('fs');
const path = require('path');

// Load Lore Data
const lorePath = path.join(__dirname, '../src/data/lore.json');
const lore = JSON.parse(fs.readFileSync(lorePath, 'utf8'));

// 1. Collect all DEFINED terms (The "Dictionary")
const definedTerms = new Set();

function addTerm(name) {
    if (!name) return;
    definedTerms.add(name);
    definedTerms.add(name.toLowerCase()); // Store lowercase for easier checking

    // Also add parts of compound names like "De Hvide Vogtere" -> "Hvide Vogtere"? 
    // No, exact match is better for now to avoid noise.
}

// Traverse Lore to build dictionary
addTerm(lore.worldName);
lore.planes.forEach(p => {
    addTerm(p.name);
    addTerm(p.id);
    p.continents.forEach(c => {
        addTerm(c.name);
        // Add races defined in continents
        c.races.forEach(r => addTerm(r.name));
        c.regions.forEach(r => {
            addTerm(r.name);
            r.cities.forEach(city => {
                addTerm(city.name);
                // Add city inhabitants/shops if they are named entities?
                // Maybe too granular, but let's see.
                city.inhabitants?.forEach(npc => addTerm(npc.name));
                city.shops?.forEach(shop => addTerm(shop.name));
            });
        });
    });
});

lore.organizations?.forEach(o => addTerm(o.name));
lore.conflict?.fractions?.forEach(f => addTerm(f.name));
lore.bestiary?.forEach(b => addTerm(b.name));
lore.travel?.forEach(t => addTerm(t.name));
lore.religion?.gods?.forEach(g => addTerm(g.name));

// 2. Scan for USED terms (The "References")
const potentialOrphans = new Map(); // Term -> Location[]

function scanText(text, location) {
    if (!text) return;

    // Regex to find potential proper nouns (capitalized words in middle of sentences, or common naming patterns)
    // This is heuristic and will be noisy.
    const regex = /\b[A-ZÆØÅ][a-zæøå]+(?:-[A-ZÆØÅ][a-zæøå]+)*\b/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const term = match[0];

        // Filter out common false positives
        const commonWords = new Set(['Der', 'Her', 'Men', 'Det', 'En', 'Et', 'De', 'Vi', 'Du', 'I', 'På', 'Som', 'Man', 'Hvor', 'Hvis', 'Når', 'Da', 'For', 'Til', 'Med', 'Af', 'Om', 'Ved', 'Den', 'Dem', 'Deres', 'Hans', 'Hendes', 'Vores', 'Jeres', 'Min', 'Din', 'Sit', 'Sine', 'Alle', 'Mange', 'Nogle', 'Ingen', 'Alt', 'Intet', 'Selv', 'Kun', 'Også', 'Endnu', 'Hvad', 'Hvem', 'Hvilken', 'Denne', 'Dette', 'Disse', 'Både', 'Enten', 'Heller', 'Være', 'Bliver', 'Får', 'Kan', 'Skal', 'Vil', 'Må', 'Bør', 'Gør', 'Tager', 'Ser', 'Går', 'Kommer', 'Giver', 'Siger', 'Tror', 'Ved', 'Synes', 'Føler', 'Ligger', 'Står', 'Sidder', 'Løber', 'Spiser', 'Drikker', 'Sover', 'Drømmer', 'Tænker', 'Hører', 'Lugter', 'Smager', 'Føles', 'Virker', 'Ligner', 'Kaldes', 'Hedder', 'Bruges', 'Findes', 'Skyldes', 'Skygge-Siden', 'Lys-Siden']); // Add valid but already handled terms to ignore list if needed

        if (commonWords.has(term)) continue;
        if (definedTerms.has(term.toLowerCase())) continue;

        // If not defined, flag it
        if (!potentialOrphans.has(term)) {
            potentialOrphans.set(term, []);
        }
        if (potentialOrphans.get(term).length < 3) { // Limit occurrences recorded
            potentialOrphans.get(term).push(location);
        }
    }
}

// Traverse Lore again to scan descriptions
lore.planes.forEach(p => {
    scanText(p.description, `Plane: ${p.name}`);
    p.continents.forEach(c => {
        scanText(c.description, `Continent: ${c.name}`);
        scanText(c.socialDynamics?.conflict, `Continent: ${c.name} (Conflict)`);
        c.regions.forEach(r => {
            scanText(r.desc, `Region: ${r.name}`);
            r.cities.forEach(city => {
                scanText(city.desc, `City: ${city.name} (Desc)`);
                scanText(city.rumor, `City: ${city.name} (Rumor)`);
            });
        });
        c.races.forEach(r => {
            scanText(r.description, `Race: ${r.name}`);
        });
    });
});

lore.organizations?.forEach(o => scanText(o.desc, `Org: ${o.name}`));
lore.conflict?.fractions?.forEach(f => scanText(f.goal, `Faction: ${f.name}`));
lore.bestiary?.forEach(b => scanText(b.desc, `Bestiary: ${b.name}`));

// 3. Report
console.log("--- Audit Report: Potential Undefined Terms ---");
console.log("(Terms capitalized in text but not found as Keys in lore.json)");
console.log("-----------------------------------------------");

potentialOrphans.forEach((locations, term) => {
    // Basic filter for very short words or obviously not names
    if (term.length < 3) return;

    console.log(`[?] ${term}`);
    locations.forEach(loc => console.log(`    found in: ${loc}`));
});
