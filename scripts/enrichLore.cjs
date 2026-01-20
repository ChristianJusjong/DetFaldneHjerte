
const fs = require('fs');
const path = require('path');

const lorePath = path.join(__dirname, '../src/data/lore.json');
const lore = JSON.parse(fs.readFileSync(lorePath, 'utf8'));

// Helper arrays for random generation based on theme
const THEMES = {
    'tanketinderne': {
        layouts: ['Bygget vertikalt op ad bjergsiden med svævebaner.', 'Udhugget i selve klippen i store spiralmønstre.', 'Består af høje tårne forbundet med lyn-afledere.', 'En labyrint af biblioteker og læsesale.'],
        shopTypes: ['Boghandel', 'Scroll-smed', 'Krystal-sliber', 'Lyn-fanger', 'Blæk-blander'],
        shopNames: ['Tankens Flugt', 'Det Glemte Ord', 'Stormens Øje', 'Den Sidste Side', 'Gnisten'],
        npcRoles: ['Vismand', 'Bibliotekar', 'Storm-jæger', 'Arkivar', 'Logiker'],
        npcWants: ['At finde en glemt bog', 'At fange et sjældent lyn', 'At bevise en teori', 'At få ro til at læse']
    },
    'spejlsoeen': {
        layouts: ['Bygninger af krystal der bryder lyset.', 'Svævende platforme over det mørke vand.', 'Huse lavet af envejs-spejle.', 'Skjult bag en permanent illusion.'],
        shopTypes: ['Spejl-mager', 'Illusionist', 'Glas-puster', 'Sandheds-sælger', 'Farve-handler'],
        shopNames: ['Det Sande Spejlbillede', 'Prismet', 'Glimt i Øjet', 'Refleksioner', 'Klarhed'],
        npcRoles: ['Glas-ridder', 'Illusionist', 'Spejl-vagt', 'Drømme-tyder', 'Lys-formeren'],
        npcWants: ['At se sit sande ansigt', 'At skjule en hemmelighed', 'At finde den perfekte farve', 'At bryde en forbandelse']
    },
    'klangdalene': {
        layouts: ['Formet som et amfiteater for at fange lyden.', 'Hænger som vindspil fra klipperne.', 'Bygget af hule sten, der synger i vinden.', 'En tavs by under jorden.'],
        shopTypes: ['Instrument-mager', 'Lyd-tapper', 'Stilheds-sælger', 'Ekkolods-kortlægger', 'Stemme-smed'],
        shopNames: ['Det Høje C', 'Hvisken', 'Torden-Boxen', 'Den Knuste Flaske', 'Genklang'],
        npcRoles: ['Bard', 'Lyd-samler', 'Vind-danser', 'Tromme-vagt', 'Stilheds-munk'],
        npcWants: ['At finde den tabte tone', 'At stjæle en stemme', 'At høre stilheden', 'At overdøve stormen']
    },
    'solvtungenaesset': {
        layouts: ['Store åbne markedspladser og banket-haller.', 'Huse bygget ovenpå gamle kæmperuiner.', 'Vandveje i stedet for gader (Venedig-stil).', 'Befæstet mod jordskælv med tunge jernkæder.'],
        shopTypes: ['Delikatesse', 'Krydderi-handler', 'Vin-importør', 'Oversætter', 'Diplomat-udstyr'],
        shopNames: ['Den Gyldne Ske', 'Søde Ord', 'Kæde-Reaktionen', 'Festsalen', 'Det Sidste Måltid'],
        npcRoles: ['Gourmet-kok', 'Diplomat', 'Smagsdommer', 'Kæde-arbejder', 'Gift-blander'],
        npcWants: ['At smage den legendariske trøffel', 'At afsløre en løgn', 'At arrangere et bryllup', 'At holde jorden samlet']
    },
    'tvillingeoerne': {
        layouts: ['Svævende øer forbundet med energibroer.', 'Huse der ændrer form efter beboernes humør.', 'Krystallinske strukturer der vokser organisk.', 'Bygget på undersiden af en svæve-ø.'],
        shopTypes: ['Trylle-butik', 'Form-skifter-salon', 'Sjæle-smed', 'Tyngdekrafts-neutralisator', 'Drømme-bager'],
        shopNames: ['Det Tredje Øje', 'Nye Former', 'Sjæle-Mødet', 'Svæve-Baren', 'Drømmeland'],
        npcRoles: ['Tvillinge-mage', 'Form-vandrer', 'Skal-vagt', 'Astral-raider', 'Mana-samler'],
        npcWants: ['At finde sin tvilling', 'At skifte form permanent', 'At besøge en anden verden', 'At beskytte ægget']
    },
    'urskoven': {
        layouts: ['Træhuse bygget ind i gigantiske trærødder.', 'Huler bag ved blod-røde vandfald.', 'Platforme i trækronerne.', 'Bygget af levende knogler og planter.'],
        shopTypes: ['Urtesamler', 'Knogleskærer', 'Gift-brygger', 'Blod-heks', 'Totem-mager'],
        shopNames: ['Rodnettet', 'Den Røde Dråbe', 'Knogleskuret', 'Livets Træ', 'Spore-Huset'],
        npcRoles: ['Druide', 'Jæger', 'Blod-heks', 'Svampe-dyrker', 'Beastmaster'],
        npcWants: ['At helbrede skoven', 'At dræbe et apex-monster', 'At gro en ny arm', 'At tale med forfædrene']
    },
    'slamsumpen': {
        layouts: ['Rustne metalstrukturer og rør-systemer.', 'Flydende platforme på syre-søer.', 'Hermetisk lukkede glastårne.', 'Underjordiske bunkere.'],
        shopTypes: ['Skrot-handler', 'Alkymist', 'Mekaniker', 'Filter-sælger', 'Syre-dykker'],
        shopNames: ['Rust & Retfærdighed', 'Syrebadet', 'Den Rene Luft', 'Kluns', 'Eksplosionen'],
        npcRoles: ['Artificer', 'Skrot-samler', 'Renheds-aristokrat', 'Mudder-dykker', 'Gift-ekspert'],
        npcWants: ['At bygge en bombe', 'At finde rent vand', 'At rense sit blod', 'At finde en sjælden del']
    }
};

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateShops(theme, count = 3) {
    const shops = [];
    const usedNames = new Set();

    for (let i = 0; i < count; i++) {
        let name = getRandomItem(theme.shopNames);
        let tries = 0;
        while (usedNames.has(name) && tries < 10) {
            name = getRandomItem(theme.shopNames) + ' ' + (['I', 'II', 'ApS', '& Søn'][Math.floor(Math.random() * 4)]);
            tries++;
        }
        usedNames.add(name);

        shops.push({
            name: name,
            type: getRandomItem(theme.shopTypes),
            desc: `En ${['travl', 'støvet', 'mystisk', 'luksuriøs', 'uhyggelig'][Math.floor(Math.random() * 5)]} butik der lugter af ${['krydderier', 'ozon', 'gammelt papir', 'metal', 'svovl'][Math.floor(Math.random() * 5)]}.`,
            owner: generateName()
        });
    }
    return shops;
}

function generateName() {
    const prefixes = ['Gor', 'Xal', 'Vin', 'Dra', 'Mor', 'Lyo', 'Zin', 'Kas', 'Fen', 'Bri'];
    const suffixes = ['ton', 'ia', 'os', 'ra', 'mund', 'ix', 'dor', 'wen', 'th', 'us'];
    return prefixes[Math.floor(Math.random() * prefixes.length)] + suffixes[Math.floor(Math.random() * suffixes.length)];
}

function generateNPCs(theme, count = 3) {
    const npcs = [];
    for (let i = 0; i < count; i++) {
        npcs.push({
            name: generateName(),
            role: getRandomItem(theme.npcRoles),
            desc: `En ${['høj', 'lav', 'arret', 'smuk', 'gammel'][Math.floor(Math.random() * 5)]} person med ${['intense', 'trætte', 'lysende', 'blinde', 'skiftende'][Math.floor(Math.random() * 5)]} øjne.`,
            wants: getRandomItem(theme.npcWants)
        });
    }
    return npcs;
}

// MAIN LOOP
lore.planes.forEach(plane => {
    plane.continents.forEach(continent => {
        const theme = THEMES[continent.id] || THEMES['tanketinderne']; // Fallback

        continent.regions.forEach(region => {
            region.cities.forEach(city => {
                // If data already exists, skip or overwrite? Let's overwrite/ensure existance
                if (!city.layout) {
                    city.layout = getRandomItem(theme.layouts);
                }
                if (!city.shops || city.shops.length === 0) {
                    city.shops = generateShops(theme, Math.floor(Math.random() * 3) + 2); // 2-4 shops
                }
                if (!city.inhabitants || city.inhabitants.length === 0) {
                    city.inhabitants = generateNPCs(theme, Math.floor(Math.random() * 3) + 2); // 2-4 NPCs
                }

                // Ensure mapImage placeholder is set (will be replaced by generated maps)
                if (!city.mapImage) {
                    // city.mapImage = /src/assets/cities/${city.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png;
                }
            });
        });
    });
});

fs.writeFileSync(lorePath, JSON.stringify(lore, null, 2), 'utf8');
console.log('Lore enrichment complete!');
