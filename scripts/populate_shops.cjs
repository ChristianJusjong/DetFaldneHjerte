const fs = require('fs');
const path = require('path');

const LORE_PATH = path.join(__dirname, '../src/data/lore.json');
const lore = JSON.parse(fs.readFileSync(LORE_PATH, 'utf8'));

// Catalog Data Generator
const getCatalog = (subtype, ownerName) => {
    const catalysts = [
        { name: "Lille Helbredelses-Elixir", price: "50 gp", desc: "Smager lidt af kirsebær." },
        { name: "Scroll of Identify", price: "100 gp", desc: "Beskrevet med blåt blæk." },
        { name: "Potte med Lim", price: "10 gp", desc: "Meget klistret." },
    ];

    const smithItems = [
        { name: "Langsværd", price: "15 gp", desc: "Standard stål." },
        { name: "Skjold med Byvåben", price: "10 gp", desc: "Malet i byens farver." },
        { name: "Slibesten", price: "1 gp", desc: "God til at holde klingen skarp." },
    ];

    const bookItems = [
        { name: "Historien om Titanen", price: "25 gp", desc: "Læderindbundet." },
        { name: "Kort over Regionen", price: "5 gp", desc: "Lidt krøllet." },
        { name: "Blæk og Fjer", price: "2 gp", desc: "Sort blæk." },
    ];

    const magicItems = [
        { name: "Krystal-skår", price: "15 gp", desc: "Lyser svagt." },
        { name: "Fokus-stav", price: "10 gp", desc: "Lavet af taks." },
        { name: "Tryllebog (Tom)", price: "50 gp", desc: "Højkvalitets papir." }
    ];

    // Simple matching based on text
    const lowerSub = (subtype || "").toLowerCase();
    if (lowerSub.includes('smed')) return smithItems;
    if (lowerSub.includes('bog') || lowerSub.includes('papir') || lowerSub.includes('scroll')) return bookItems;
    if (lowerSub.includes('krystal') || lowerSub.includes('magi') || lowerSub.includes('lyn')) return magicItems;

    return catalysts;
};

// Process
lore.planes.forEach(plane => {
    if (!plane.continents) return;
    plane.continents.forEach(cont => {
        if (!cont.regions) return;
        cont.regions.forEach(reg => {
            if (!reg.cities) return;
            reg.cities.forEach(city => {
                if (!city.districts) return;
                city.districts.forEach(dist => {
                    if (!dist.assets) return;
                    dist.assets.forEach(asset => {
                        if (asset.type === 'shop' && !asset.inventory) {
                            console.log(`Populating catalog for ${asset.name} in ${city.name}...`);
                            asset.inventory = getCatalog(asset.subtype, asset.owner);

                            // Ensure Owner is an Object if it was a string?
                            // The types support `owner?: string` AND `shopkeeper?: object`.
                            // Let's adhere to the new type definition.
                            if (!asset.shopkeeper && asset.owner) {
                                asset.shopkeeper = {
                                    name: asset.owner,
                                    desc: `Ejeren af ${asset.name}.`,
                                    quirk: "Altid travl."
                                };
                            }
                        }
                    });
                });
            });
        });
    });
});

fs.writeFileSync(LORE_PATH, JSON.stringify(lore, null, 2));
console.log("Lore updated with catalogs!");
