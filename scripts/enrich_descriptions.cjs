const fs = require('fs');
const path = require('path');

const LORE_PATH = path.join(__dirname, '../src/data/lore.json');
const lore = JSON.parse(fs.readFileSync(LORE_PATH, 'utf8'));

let changes = 0;

const adjectives = ["travl", "stille", "mystisk", "gammel", "støjende", "farverig", "mørk", "lysende", "faldefærdig", "majestætisk"];
const verbs = ["summer af liv", "ligger øde hen", "vogter over regionen", "skjuler mange hemmeligheder", "genanlyder af magi", "lugter af krydderier", "er fyldt med håb", "er præget af frygt"];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function enrich(type, entity, parentName, context) {
    const isWeak = !entity.desc || entity.desc.length < 30 || entity.desc.includes("Generic");
    if (!isWeak) return;

    let newDesc = entity.desc;

    // Templates based on Entity Name/Type
    if (entity.name === "Centrum") {
        newDesc = `Det bankende hjerte i ${parentName}. Her mødes alle veje, og luften ${getRandom(verbs)}. Markedet er fyldt med varer fra hele ${context || 'verden'}.`;
    } else if (entity.name.includes("Havn")) {
        newDesc = `Knudepunktet for handel i ${parentName}. Skibe fra fjerne egne lægger til her, og havnen ${getRandom(verbs)}.`;
    } else if (entity.name === "Vagten" || entity.name.includes("Post")) {
        newDesc = `Den primære forsvarslinje for ${parentName}. Soldaterne her ${getRandom(verbs)} og holder øje med enhver trussel.`;
    } else if (type === "Shop") {
        newDesc = `En ${getRandom(adjectives)} butik i ${parentName}, kendt for sit særlige udvalg. ${entity.owner ? "Ejeren " + entity.owner + " er kendt vide og bredt." : "Kunderne hvisker om de varer der sælges her."}`;
    } else if (type === "District") {
        newDesc = `Et ${getRandom(adjectives)} distrikt i ${parentName}, hvor indbyggerne ${getRandom(verbs)}. Arkitekturen bærer præg af ${context || 'historien'}.`;
    } else {
        // Fallback generic enrichment
        newDesc = `${entity.name} er en vigtig del af ${parentName}. Stedet ${getRandom(verbs)} og er ${getRandom(adjectives)}.`;
    }

    if (newDesc !== entity.desc) {
        console.log(`Enriching [${type}] ${entity.name} in ${parentName}`);
        console.log(`   OLD: ${entity.desc}`);
        console.log(`   NEW: ${newDesc}`);
        entity.desc = newDesc;
        changes++;
    }
}

// Traverse
lore.planes.forEach(plane => {
    if (plane.continents) plane.continents.forEach(cont => {
        if (cont.regions) cont.regions.forEach(reg => {
            if (reg.cities) reg.cities.forEach(city => {
                enrich('City', city, reg.name, cont.name);
                if (city.districts) city.districts.forEach(dist => {
                    enrich('District', dist, city.name, reg.name);
                    if (dist.assets) dist.assets.forEach(asset => {
                        enrich(asset.type === 'shop' ? 'Shop' : 'Asset', asset, dist.name, city.name);
                    });
                });
            });
        });
    });
});

if (changes > 0) {
    fs.writeFileSync(LORE_PATH, JSON.stringify(lore, null, 2));
    console.log(`Enriched ${changes} descriptions.`);
} else {
    console.log("No usage found for enrichment.");
}
