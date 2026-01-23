const fs = require('fs');
const path = require('path');

const lorePath = path.join(__dirname, '../src/data/lore.json');
const loreData = JSON.parse(fs.readFileSync(lorePath, 'utf8'));

// 2024 Species Templates
const speciesTemplates = {
    'elf': {
        traits: [
            { name: "Darkvision", desc: "60 ft range." },
            { name: "Fey Ancestry", desc: "Advantage on saves vs Charmed. Magic can't put you to sleep." },
            { name: "Keen Senses", desc: "Proficiency in Perception." },
            { name: "Trance", desc: "4 hours rest for long rest benefits." }
        ]
    },
    'dwarf': {
        traits: [
            { name: "Darkvision", desc: "120 ft range." },
            { name: "Dwarven Resilience", desc: "Resistance to Poison damage and advantage on Poison saves." },
            { name: "Dwarven Toughness", desc: "+1 HP per level." },
            { name: "Stonecunning", desc: "Tremorsense on stone surfaces (Range 60ft) as a bonus action." }
        ]
    },
    'gnome': {
        traits: [
            { name: "Darkvision", desc: "60 ft range." },
            { name: "Gnomish Cunning", desc: "Advantage on INT, WIS, CHA saves vs magic." }
        ]
    },
    'halfling': {
        traits: [
            { name: "Lucky", desc: "Reroll 1s on d20 tests." },
            { name: "Brave", desc: "Advantage on saves vs Frightened." },
            { name: "Halfling Nimbleness", desc: "Move through space of creatures larger than you." }
        ]
    },
    'orc': {
        traits: [
            { name: "Adrenaline Rush", desc: "Bonus action Dash. Gain temp HP." },
            { name: "Darkvision", desc: "120 ft range." },
            { name: "Powerful Build", desc: "Count as one size larger for carrying capacity." },
            { name: "Relentless Endurance", desc: "Drop to 1 HP instead of 0 once per long rest." }
        ]
    },
    'tiefling': {
        traits: [
            { name: "Darkvision", desc: "60 ft range." },
            { name: "Hellish Resistance", desc: "Resistance to Fire damage." },
            { name: "Infernal Legacy", desc: "Knows Thaumaturgy, Hellish Rebuke (3rd), Darkness (5th)." }
        ]
    },
    'human': {
        traits: [
            { name: "Resourceful", desc: "Gain Heroic Inspiration daily." },
            { name: "Skillful", desc: "Proficiency in one skill of choice." },
            { name: "Versatile", desc: "Gain an Origin Feat of choice." }
        ]
    },
    'goliath': {
        traits: [
            { name: "Mountain Born", desc: "Resistance to Cold damage." },
            { name: "Stone's Endurance", desc: "Reaction to reduce damage by 1d12 + Con." },
            { name: "Powerful Build", desc: "Count as one size larger for carrying capacity." }
        ]
    },
    'dragonborn': {
        traits: [
            { name: "Breath Weapon", desc: "Exhale destructive energy (Line or Cone)." },
            { name: "Draconic Resistance", desc: "Resistance to damage type associated with ancestry." },
            { name: "Darkvision", desc: "60 ft range." }
        ]
    },
    'aasimar': {
        traits: [
            { name: "Celestial Resistance", desc: "Resistance to Necrotic and Radiant damage." },
            { name: "Darkvision", desc: "60 ft range." },
            { name: "Healing Hands", desc: "Touch to heal 1d4 + PB HP." },
            { name: "Light Bearer", desc: "Know the Light cantrip." }
        ]
    }
};

// Map current "Reskin" values to 2024 templates
function matchTemplate(reskinString) {
    if (!reskinString) return null;
    const lower = reskinString.toLowerCase();

    if (lower.includes('elf') || lower.includes('eladrin') || lower.includes('shadar-kai') || lower.includes('drow')) return speciesTemplates.elf;
    if (lower.includes('dwarf')) return speciesTemplates.dwarf;
    if (lower.includes('gnome') || lower.includes('genasi')) return speciesTemplates.gnome; // Genasi mapped to Gnome structure for now or generic elemental
    if (lower.includes('halfling')) return speciesTemplates.halfling;
    if (lower.includes('orc')) return speciesTemplates.orc;
    if (lower.includes('tiefling') || lower.includes('yuan-ti')) return speciesTemplates.tiefling;
    if (lower.includes('human')) return speciesTemplates.human;
    if (lower.includes('goliath')) return speciesTemplates.goliath;
    if (lower.includes('dragonborn')) return speciesTemplates.dragonborn;
    if (lower.includes('aasimar')) return speciesTemplates.aasimar;

    return null;
}

// Traversal and Update
loreData.planes.forEach(plane => {
    if (plane.continents) {
        plane.continents.forEach(continent => {
            if (continent.races) {
                continent.races.forEach(race => {
                    const slug = race.name.toLowerCase()
                        .replace(/æ/g, 'ae')
                        .replace(/ø/g, 'oe')
                        .replace(/å/g, 'aa')
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-');

                    // 1. Standardize ID and Image
                    race.id = slug; // Ensure ID matches
                    race.image = `/assets/races/${slug}.png`;

                    // 2. Update Stats to 2024
                    const template = matchTemplate(race.reskin);
                    if (template) {
                        if (!race.manual) race.manual = {};

                        // NOTE: 2024 Rules move stats to Backgrounds.
                        race.manual.stats = "Determined by Background";
                        race.manual.abilities = template.traits;

                        // Keep specific mechanics if they are unique to the lore
                        if (race.mechanic && !race.mechanic.includes('See capabilities')) {
                            // race.manual.abilities.push({ name: "Lore Mechanic", desc: race.mechanic });
                        }
                    }
                });
            }
        });
    }
});

fs.writeFileSync(lorePath, JSON.stringify(loreData, null, 2), 'utf8');
console.log('Race data updated to D&D 2024 standards!');
