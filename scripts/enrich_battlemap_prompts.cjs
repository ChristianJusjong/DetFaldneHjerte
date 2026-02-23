const fs = require('fs');
const path = require('path');

// Paths
const LORE_PATH = path.join(__dirname, '../src/data/modules/planes.json');
const OUTPUT_PATH = path.join(__dirname, '../src/data/battlemap_prompts_enriched.json');
const ARTIFACT_PATH = 'C:/Users/christian.jusjong/.gemini/antigravity/brain/79c277bb-530b-493a-99f3-57592876019f/battlemap_prompts.md';

// Helper to clean strings and remove raw data keys
const clean = (str) => {
    if (!str) return '';
    let cleaned = str
        .replace(/Fantasy landscape with distinct magical features\.?/gi, '')
        .replace(/Aesthetic:/gi, '')
        .replace(/distinct features:/gi, '')
        .replace(/Specific features:/gi, '')
        .replace(/Layout:/gi, '')
        .replace(/Local terrain:/gi, '')
        .replace(/Settlement located in .*?\./gi, '')
        .replace(/Region in .*?\./gi, '')
        .replace(/[\r\n]+/g, ' ')
        .replace(/\.\./g, '.')
        .trim();
    if (cleaned === '.') return '';
    return cleaned;
};

// Advanced Visuals Analysis - Returns Biome Template
function getBiomeTemplate(text) {
    const t = text.toLowerCase();
    const includes = (word) => t.includes(word);

    // Default
    let biome = {
        name: "Generic Fantasy",
        terrain: "The terrain is a mix of packed dirt and worn stone, typical of a traveled fantasy road.",
        arch: "Structures are pragmatic, built from local timber and stone with slate roofs.",
        light: "Natural sunlight casts distinct shadows, suggesting a clear day.",
        atmo: "The atmosphere is neutral but expectant, ready for adventure."
    };

    // 1. Crystal / Glass
    if (includes('krystal') || includes('glas') || includes('spejl') || includes('prisme') || includes('diamant')) {
        biome = {
            name: "Crystal",
            terrain: "The ground is a fracturing mosaic of semi-translucent crystal shards and smooth, glass-like obsidian. Light refracts through the floor itself.",
            arch: "Buildings are grown rather than built, forming impossibly tall, transparent spires that merge seamlessly with the crystalline bedrock.",
            light: "Prismatic light scatters everywhere, creating rainbows and blinding flares. Bioluminescent veins pulse deep within the structures.",
            atmo: "The air hums with a high-pitched resonance. It feels sterile, sharp, and electrically charged."
        };
    }
    // 2. Industrial / Metal
    else if (includes('svovl') || includes('ozon') || includes('metal') || includes('jern') || includes('fabrik') || includes('maskin') || includes('kobber') || includes('messing') || includes('damp') || includes('rør')) {
        biome = {
            name: "Industrial",
            terrain: "Rusted iron gratings and oil-stained concrete form the harsh floor. Puddles of chemical sludge hiss and bubble.",
            arch: "Massive brass gears, copper piping, and smokestacks dominate the architecture. Everything looks heavy, functional, and worn.",
            light: "Sickly green and orange warning lights flicker constantly. Sudden sparks from machinery cast harsh, dancing shadows.",
            atmo: "The air tastes of copper and smoke. The ground vibrates rhythmically with the grinding of unseen engines."
        };
    }
    // 3. Forest / Nature
    else if (includes('skov') || includes('træ') || includes('natur') || includes('svamp') || includes('mos')) {
        biome = {
            name: "Forest",
            terrain: "Deep moss, tangled roots, and decaying leaf litter cover the soft earth. Muddy game trails weave through the undergrowth.",
            arch: "Structures are organic, carved into living giant trees or formed from massive, intertwined vines and giant mushrooms.",
            light: "Dappled sunlight filters through the canopy in god-rays. Shadows are deep and soft, hiding movement.",
            atmo: "The air is cool, damp, and smells of pine and loam. The silence is heavy, broken only by the rustle of leaves."
        };
    }
    // 4. Desert / Spice
    else if (includes('krydderi') || includes('støv') || includes('sand') || includes('ørken') || includes('rød') || includes('tørke') || includes('hede')) {
        biome = {
            name: "Desert",
            terrain: "Fine red sand shifts over cracked, parched earth. Heat waves distort the view of the rocky, wind-eroded ground.",
            arch: "Low, dome-shaped adobe and sandstone buildings huddle together for shade. Tattered fabrics flap in the dry wind.",
            light: "The sun is blinding and relentless, casting stark, pitch-black shadows. The color palette is monochromatic orange and ochre.",
            atmo: "The air is stiflingly hot and dry, carrying the scent of exotic spices and ancient dust."
        };
    }
    // 5. Mountain / Wind
    else if (includes('bjerg') || includes('sten') || includes('klippe') || includes('vind') || includes('kløft')) {
        biome = {
            name: "Mountain",
            terrain: "Sheer granite cliffs and narrow shelf-roads define this vertical landscape. Loose shale and ice make footing treacherous.",
            arch: "Stone fortresses cling to the cliffside, anchored by massive iron chains. Bridges are terrifyingly narrow and sway in the wind.",
            light: "Cold, clear high-altitude light washes out colors. Shadows are long and blue, stretching over the abyss.",
            atmo: "The wind is a constant, deafening roar. The air is thin and freezing, biting at exposed skin."
        };
    }
    // 6. Water / Swamp
    else if (includes('vand') || includes('hav') || includes('sø') || includes('sump') || includes('salt')) {
        biome = {
            name: "Water",
            terrain: "Dark, murky water surrounds everything. Wooden walkways and rotting piers serve as the only solid ground.",
            arch: "Buildings stand on stilts, their bases slick with algae and barnacles. Wood is swollen and damp.",
            light: "Reflections on the water create a shimmering, restless lighting effect. Fog obscures the edges of vision.",
            atmo: "The smell of salt, fish, and rot is overwhelming. A cold mist clings to everything."
        };
    }
    // 7. Gold / Luxury
    else if (includes('guld') || includes('honning') || includes('rav') || includes('bi') || includes('voks')) {
        biome = {
            name: "Luxury",
            terrain: "Polished amber and gold-veined marble form the ground. Rivers of slow-flowing honey cut through the opulence.",
            arch: "Excessive wealth is everywhere—golden domes, beeswax pillars, and walls inlaid with precious gems.",
            light: "A warm, golden glow permeates the scene, softening all edges. Surfaces gleam and sparkle.",
            atmo: "The air is sweet, warm, and heavy with perfume. It feels indulgent and lazy."
        };
    }
    // 8. Candy
    else if (includes('slik') || includes('sukker') || includes('sirup') || includes('kage')) {
        biome = {
            name: "Candy",
            terrain: "The ground resembles sponge cake or cookie crumble. Rivers of milk or syrup wind through pastel-colored hills.",
            arch: "Houses are made of gingerbread and candy canes. Windows are transparent sugar glass.",
            light: "Bright, high-key lighting makes the pastel colors pop. It looks like a cartoon brought to life.",
            atmo: "The smell is sickeningly sweet—vanilla and strawberry. The vibe is cheerful but unnervingly artificial."
        };
    }
    // 9. Ice
    else if (t.includes(' is ') || t.startsWith('is ') || t.includes('is.') || t.includes('is,') || t.includes(' sne') || includes('frost') || includes('kulde') || includes('frossen')) {
        biome = {
            name: "Ice",
            terrain: "Deep blue glacial ice covered in fresh powder snow. Slippery, transparent surfaces reveal frozen depths below.",
            arch: "Structures are carved directly from the ice, seamless and flowing. They glow with a faint blue inner light.",
            light: "Blinding white glare from the snow contrasts with deep indigo shadows. Auroras may shimmer overhead.",
            atmo: "The cold is absolute. Silence reigns, broken only by the cracking of the ice."
        };
    }

    return biome;
}

// Master Prompt Builder
function generatePrompt(locationType, name, details, regionContext = '') {
    // 1. Combine all text to deduce biome
    const combinedText = `${name} ${details.desc || ''} ${details.atmosphere || ''} ${details.architecture || ''} ${details.visualSummary || ''} ${details.rumor || ''} ${regionContext}`;
    const biome = getBiomeTemplate(combinedText);

    // 2. Extract specific details
    const specificDesc = clean(details.desc);
    const specificAtmo = clean(details.atmosphere);
    const specificArch = clean(details.architecture);
    const specificLayout = clean(details.layout);
    const districtList = details.districts ? details.districts.map(d => d.name).join(", ") : "";

    // 3. Build the prompt BLOCK BY BLOCK
    let prompt = `**Subject:** A high-fidelity, top-down battlemap of **${name}**, a ${locationType} in the ${regionContext}. \n\n`;

    // --- PARAGRAPH 1: TERRAIN & ATMOSPHERE ---
    prompt += `**Visual Setting:**\n`;
    prompt += `${biome.terrain} `;
    if (specificDesc) prompt += `${specificDesc} `;
    prompt += `${biome.atmo} `;
    if (specificAtmo) prompt += `${specificAtmo} `;
    prompt += `The environment feels visually distinct compared to a generic ${biome.name.toLowerCase()} setting. `;

    // --- PARAGRAPH 2: ARCHITECTURE & STRUCTURE ---
    prompt += `\n\n**Architecture & Structure:**\n`;
    prompt += `${biome.arch} `;
    if (specificArch) prompt += `${specificArch} `;
    if (specificLayout) prompt += `The layout defines the tactical space: ${specificLayout}. `;
    if (districtList) prompt += `Key districts like ${districtList} are hinted at in the urban planning. `;
    prompt += `Details are weathered and realistic, showing signs of inhabitation. `;

    // --- PARAGRAPH 3: LIGHTING & VIBE ---
    prompt += `\n\n**Lighting & Mood:**\n`;
    prompt += `${biome.light} `;
    if (details.rumor) prompt += `The scene carries a narrative weight: ${clean(details.rumor)} `;
    prompt += `Shadows are dramatic and define the depth of the map. The color palette is cohesive with the ${biome.name} theme. `;

    // --- PARAGRAPH 4: TECHNICAL ---
    prompt += `\n\n**Technical Specs:**\n`;
    prompt += `Top-down orthographic view (90 degrees). Flat 2D battlemap. No perspective distortion. 8k resolution. Aspect Ratio 16:9. High contrast for VTT visibility. Uncropped. --ar 16:9 --v 6.0`;

    return prompt;
}

try {
    const planes = JSON.parse(fs.readFileSync(LORE_PATH, 'utf8'));
    const prompts = [];
    let markdownOutput = "# Enriched Battlemap Prompts\n\nDetailed, unique, and narrative prompts for every location.\n\n";

    planes.forEach(plane => {
        plane.continents.forEach(continent => {
            if (continent.regions) {
                continent.regions.forEach(region => {
                    const regionSlug = region.name.toLowerCase().replace(/\s+/g, '-');

                    // Region Wilderness Encounter
                    const regionDetails = {
                        desc: region.desc,
                        visualSummary: region.visualSummary,
                        // Regions might lack specific atmosphere/arch fields, so we rely on biome deduction
                    };

                    const regionPrompt = generatePrompt(
                        'wilderness encounter',
                        region.name,
                        regionDetails,
                        `Region: ${region.name} (${continent.name})`
                    );

                    prompts.push({
                        id: `${regionSlug}-encounter`,
                        filename: `${regionSlug}-encounter.png`,
                        prompt: regionPrompt
                    });

                    markdownOutput += `## Region: ${region.name}\n`;
                    markdownOutput += `**Filename:** ${regionSlug}-encounter.png\n`;
                    markdownOutput += `**Prompt:** \n\`\`\`\n${regionPrompt}\n\`\`\`\n\n`;

                    if (region.cities) {
                        region.cities.forEach(city => {
                            const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');

                            // Pass the WHOLE city object as details + visualSummary if it exists (it often doesn't on city, but checking anyway)
                            const cityDetails = {
                                ...city,
                                visualSummary: city.visualSummary || region.visualSummary // Fallback to region for biome detection help
                            };

                            const cityPrompt = generatePrompt(
                                'city street encounter',
                                city.name,
                                cityDetails,
                                `City in ${region.name}`
                            );

                            prompts.push({
                                id: `${citySlug}-encounter`,
                                filename: `${citySlug}-encounter.png`,
                                prompt: cityPrompt
                            });

                            markdownOutput += `### City: ${city.name}\n`;
                            markdownOutput += `**Filename:** ${citySlug}-encounter.png\n`;
                            markdownOutput += `**Prompt:** \n\`\`\`\n${cityPrompt}\n\`\`\`\n\n`;
                        });
                    }
                });
            }
        });
    });

    // Write JSON
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(prompts, null, 2));
    console.log(`Generated ${prompts.length} unique narrative prompts in ${OUTPUT_PATH}`);

    // Write Markdown Artifact
    fs.writeFileSync(ARTIFACT_PATH, markdownOutput);
    console.log(`Updated artifact at ${ARTIFACT_PATH}`);

} catch (error) {
    console.error('Error processing lore:', error);
}
