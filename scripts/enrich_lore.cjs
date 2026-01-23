const fs = require('fs');
const path = require('path');

const lorePath = path.join(__dirname, '../src/data/lore.json');
const loreData = JSON.parse(fs.readFileSync(lorePath, 'utf8'));

// --- GENERATOR DATA POOLS ---

const commonItems = [
    { name: "Rejse-beholder", price: "5gp", desc: "Forseglet beholder til mad og vand." },
    { name: "Klatre-sæt", price: "25gp", desc: "Reb, kroge og handsker." },
    { name: "Lygte-olie", price: "1sp", desc: "Brænder i 6 timer." },
    { name: "Læge-urt", price: "1gp", desc: "Stabiliserer sår." }
];

const themes = {
    'tanketinderne': {
        items: [
            { name: "Tom Scroll", price: "10gp", desc: "Pergament klar til magi." },
            { name: "Blæk (Blå)", price: "5gp", desc: "Lyser svagt i mørke." },
            { name: "Hukommelses-Krystal", price: "50gp", desc: "Kan lagre en tanke." },
            { name: "Fokus-Linse", price: "25gp", desc: "Hjælper med koncentration." }
        ],
        quirks: ["Taler i gåder", "Glemmer midt i sætninger", "Noterer alt du siger", "Mummer om logik"],
        atmosphere: "Luften er tynd og elektrisk. Det lugter af ozon og gammelt papir.",
        architecture: "Høje, snoede tårne af hvid marmor og blåt glas."
    },
    'ur-skoven': { // Assuming core biome names map to themes
        items: [
            { name: "Helbredelses-salve", price: "50gp", desc: "Lavet af sjældne mosser." },
            { name: "Jæger-pil", price: "1gp", desc: "Balanceret til langskud." },
            { name: "Spore-pulver", price: "20gp", desc: "Forvirrer fjender." },
            { name: "Rod-nøgle", price: "100gp", desc: "Åbner levende låse." }
        ],
        quirks: ["Sniffer til luften", "Har blade i håret", "Taler med planter", "Sky for fremmede"],
        atmosphere: "Luften er tung af fugt og forrådnelse. Junglelyde er konstante.",
        architecture: "Bygninger vokset direkte ud af de enorme træer."
    },
    'spejlsoeen': {
        items: [
            { name: "Sandheds-Serum", price: "150gp", desc: "Tvinger sandheden frem." },
            { name: "Illusion-Prisme", price: "40gp", desc: "Bryder lyset i farver." },
            { name: "Sølv-spejl", price: "10gp", desc: "Reflekterer sjælen." },
            { name: "Maske", price: "5gp", desc: "Skjuler ansigtet." }
        ],
        quirks: ["Stirrer intenst", "Skifter øjenfarve", "Taler i spejlbilleder", "Bærer maske"],
        atmosphere: "Lyset reflekteres fra alle overflader. Det er svært at se forskel på virkelighed og spejling.",
        architecture: "Krystalstrukturer og envejs-spejle."
    },
    'slamsumpen': {
        items: [
            { name: "Syre-hætteglas", price: "25gp", desc: "Ætser metal." },
            { name: "Gasmaske", price: "10gp", desc: "Læder og glas." },
            { name: "Filter-vand", price: "1sp", desc: "Renset mudder." },
            { name: "Rust-olie", price: "5sp", desc: "Smører gamle maskiner." }
        ],
        quirks: ["Hoster konstant", "Sælger skrot som guld", "Er dækket af olie", "Manglende tænder"],
        atmosphere: "Gule dampe hænger lavt. Lyden af boblende mudder er overalt.",
        architecture: "Rustent metal og improviserede platforme."
    },
    'klangdalene': {
        items: [
            { name: "Stemme-Dåse", price: "30gp", desc: "Gemmer en lyd." },
            { name: "Lydløs-Støvler", price: "40gp", desc: "Dæmper fodtrin." },
            { name: "Fløjte", price: "2gp", desc: "Nyttig til signalering." },
            { name: "Ørepropper", price: "1sp", desc: "Voks." }
        ],
        quirks: ["Taler meget højt", "Bruger tegnsprog", "Nynner konstant", "Lytter til vinden"],
        atmosphere: "Vinden hyler i kløfterne. Ekkoer forvrænger al tale.",
        architecture: "Udhugget i klippen for at forstærke lyd."
    },
    'default': {
        items: commonItems,
        quirks: ["Venlig", "Mistænksom", "Travl", "Søvnig"],
        atmosphere: "En travl by med mange lyde og lugte.",
        architecture: "Standard sten og træbygninger."
    }
};

// Helper: Get random items from array
function getRandom(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function getRandomOne(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// --- ENRICHMENT LOGIC ---

function enrichAsset(asset, regionId, cityAtmosphere) {
    const themeKey = Object.keys(themes).find(k => regionId.toLowerCase().includes(k)) || 'default';
    const theme = themes[themeKey] || themes['default'];

    if (asset.type === 'shop') {
        // Add Inventory if missing
        if (!asset.inventory) {
            const stock = [
                ...getRandom(commonItems, 2),
                ...getRandom(theme.items, 3)
            ];
            // Sort by price roughly (simple string sort isn't perfect but fine for mock)
            asset.inventory = stock;
        }

        // Add Shopkeeper if missing owner details
        // Note: Existing data has "owner": "Name". We map this to shopkeeper obj.
        if (asset.owner && !asset.shopkeeper) {
            asset.shopkeeper = {
                name: asset.owner,
                desc: `En ${getRandomOne(theme.quirks).toLowerCase()} butiksejer.`,
                quirk: getRandomOne(theme.quirks)
            };
        }
    }

    if (asset.type === 'npc' && !asset.appearance) {
        asset.appearance = `Klædt i ${themeKey === 'tanketinderne' ? 'kåber' : 'læder og stof'}. Ser ${getRandomOne(theme.quirks).toLowerCase()} ud.`;
    }
}

// --- GLOBAL ENRICHMENT LOGIC ---

function enrichGod(god) {
    if (!god.desc) {
        const domains = god.domain.split(', ');
        god.desc = `En mægtig guddom der repræsenterer ${domains[0].toLowerCase()} og ${domains[1] ? domains[1].toLowerCase() : 'magt'}. ${god.name} tilbedes af ${god.followers || 'mange'} og kræver absolut dedikation. Deres templer er ofte udsmykket med ${god.symbol.toLowerCase()}.`;
    }
}

function enrichFaction(faction) {
    if (!faction.desc) {
        faction.desc = `En indflydelsesrig gruppe ledet af ${faction.leader}. Deres ultimative mål er ${faction.goal.toLowerCase()}. De opererer primært i skyggerne, men deres indflydelse mærkes overalt. Medlemmer kendes på deres loyalitet overfor ${faction.loyalty}.`;
    }
    if (!faction.image) {
        // Placeholder for faction sigil logic if needed
    }
}

function enrichBestiary(beast) {
    if (!beast.image) {
        // beast.image = `/assets/bestiary/${beast.id}.png`; // Setup for future
    }
}

function enrichCity(city, regionId) {
    const themeKey = Object.keys(themes).find(k => regionId.toLowerCase().includes(k)) || 'default';
    const theme = themes[themeKey] || themes['default'];

    if (!city.atmosphere) {
        city.atmosphere = theme.atmosphere;
    }
    if (!city.architecture) {
        city.architecture = theme.architecture;
    }
    if (!city.pointsOfInterest) {
        city.pointsOfInterest = [
            "Det lokale marked",
            "Vagttårnet",
            "Kroen 'Den Hurtige Hvil'"
        ];
    }

    // Process Districts -> Assets
    if (city.districts) {
        city.districts.forEach(district => {
            if (district.assets) {
                district.assets.forEach(asset => classifyAndEnrichAsset(asset, regionId));
            }
        });
    }
}

function classifyAndEnrichAsset(asset, regionId) {
    if (asset.subtype && asset.subtype.toLowerCase().includes('smed')) {
        // Specific logic for smiths could go here, or just fall through
    }
    enrichAsset(asset, regionId);
}

// --- MAIN TRAVERSAL ---

loreData.planes.forEach(plane => {
    if (plane.continents) {
        plane.continents.forEach(continent => {
            if (continent.regions) {
                continent.regions.forEach(region => {
                    const regionIdSlug = region.name.toLowerCase().replace(/[^a-z]/g, ''); // simple norm

                    if (region.cities) {
                        region.cities.forEach(city => {
                            // Use continent ID or region name for theme detection
                            const themeContext = (continent.id + regionIdSlug).toLowerCase();
                            enrichCity(city, themeContext);
                        });
                    }
                });
            }
        });
    }
});

// 2. Global Entities
if (loreData.religion && loreData.religion.gods) {
    loreData.religion.gods.forEach(enrichGod);
}

if (loreData.conflict && loreData.conflict.fractions) {
    loreData.conflict.fractions.forEach(enrichFaction);
}

if (loreData.bestiary) {
    loreData.bestiary.forEach(enrichBestiary);
}

if (loreData.organizations) {
    loreData.organizations.forEach(org => {
        if (!org.desc) org.desc = `En organisation dedikeret til ${org.loyalty}.`;
    });
}

fs.writeFileSync(lorePath, JSON.stringify(loreData, null, 2), 'utf8');
console.log('Lore enrichment complete!');
