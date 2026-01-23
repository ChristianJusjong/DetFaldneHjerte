const fs = require('fs');
const path = require('path');

const lorePath = path.join(__dirname, '../src/data/lore.json');
const outputPath = path.join(__dirname, '../src/data/map_prompts.json');
const loreData = JSON.parse(fs.readFileSync(lorePath, 'utf8'));

// User Defined Style Rules
const WORLD_MAP_PROMPT = "A flat 2D fantasy world map, complete atlas view showing all continents and oceans. Style of high-fantasy cartography, vintage parchment texture, faded ink. Distinct continental shapes, separated by clear oceans. No text labels. --ar 2:1 --v 6.0 --stylize 250 --no grid, spherical distortion, 3D";

const SIDE_MAP_PROMPT = "A fantasy map of a large hemisphere landmass. Political map style. Distinct colored regions defining borders between nations. Marked locations for capital cities using large star icons. Neutral paper background. Clean lines. --ar 16:9 --v 6.0 --no mountains, realistic terrain, text labels, grid";

const CONTINENT_SUFFIX = "Detailed physical geography: distinct mountain chains, winding rivers, dense swamps. Thick dark lines indicating major roads connecting specific red dot markers for cities. Parchment style with hand-drawn aesthetic. --ar 3:2 --v 6.0 --no grid, text, labels, realistic satellite";

const REGION_SUFFIX = "Focus on connectivity: clear dirt roads connecting small village clusters. Varied terrain: patches of forest, farmland, and hills. Icons indicating towns (squares) and a large Capitol (castle icon). Style of a high-definition RPG game map. --ar 16:9 --v 6.0 --no grid, clouds, fog, isometric";

const CITY_SUFFIX = "View from directly above (90 degrees). Visible rooftops of houses, distinct cobblestone streets. Clear landmarks: [LANDMARKS]. Sunlit, high contrast. --ar 4:3 --v 6.0 --no isometric, angled, side-view, perspective, grid, text";

const BATTLEMAP_SUFFIX = "Strictly orthographic projection, 90-degree angle looking down. Flat 2D floorplan. High contrast between floor and walls. Lighting: [MOOD]. Texture: [TEXTURE]. --ar 16:9 --v 6.0 --no isometric, 3D, perspective, angled, roof, ceiling, overlay, grid";

const prompts = {
    world: {
        id: "world-map",
        description: "Livshjulet (Cor)",
        prompt: WORLD_MAP_PROMPT
    },
    sides: [],
    continents: [],
    regions: [],
    cities: [],
    battlemaps: []
};

// 1. Planes (Side Maps)
loreData.planes.forEach(plane => {
    prompts.sides.push({
        id: plane.id,
        name: plane.name,
        prompt: SIDE_MAP_PROMPT
    });

    // 2. Continents
    if (plane.continents) {
        plane.continents.forEach(cont => {
            // Biome extraction using enriched visual summary
            let biome = "temperate";
            const d = (cont.visualSummary || cont.description).toLowerCase();
            if (d.includes('ice') || d.includes('frozen') || d.includes('kold') || d.includes('is')) biome = "frozen tundra";
            else if (d.includes('desert') || d.includes('arid') || d.includes('ørken') || d.includes('salt')) biome = "arid desert";
            else if (d.includes('jungle') || d.includes('swamp') || d.includes('jungle') || d.includes('sump') || d.includes('wetland')) biome = "dense jungle swamp";
            else if (d.includes('mountain') || d.includes('highland') || d.includes('bjerg')) biome = "mountainous highlands";

            const prompt = `A top-down fantasy map of a single continent [${biome}]. ${cont.visualSummary || ''}. ${CONTINENT_SUFFIX}`;

            prompts.continents.push({
                id: cont.id || cont.name.toLowerCase().replace(/\s/g, '-'),
                name: cont.name,
                prompt: prompt
            });

            // 3. Regions
            if (cont.regions) {
                cont.regions.forEach(reg => {
                    let areaType = "coastal valley";
                    const rd = (reg.visualSummary || reg.desc).toLowerCase();
                    if (rd.includes('mountain') || rd.includes('bjerg') || rd.includes('peak')) areaType = "high mountain peaks";
                    else if (rd.includes('forest') || rd.includes('skov') || rd.includes('tree')) areaType = "dense ancient forest";
                    else if (rd.includes('swamp') || rd.includes('wetland') || rd.includes('sump') || rd.includes('pipe')) areaType = "murky wetland";
                    else if (rd.includes('desert') || rd.includes('dune') || rd.includes('ørken') || rd.includes('sand')) areaType = "wind-swept dunes";

                    const regionPrompt = `An illustrated top-down regional map of [${areaType}]. ${reg.visualSummary || ''}. ${REGION_SUFFIX}`;

                    const regSlug = reg.name.toLowerCase()
                        .replace(/æ/g, 'ae')
                        .replace(/ø/g, 'oe')
                        .replace(/å/g, 'aa')
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-');

                    prompts.regions.push({
                        id: regSlug,
                        name: reg.name,
                        prompt: regionPrompt
                    });

                    // 5a. Battlemaps (Wilderness Encounter for each Region)
                    let mood = "sunlit day";
                    let texture = "grass and dirt";
                    if (areaType.includes('mountain')) { mood = "windy and cold"; texture = "cracked stone and snow"; }
                    if (areaType.includes('forest')) { mood = "dappled sunlight through leaves"; texture = "forest floor with roots"; }
                    if (areaType.includes('swamp') || areaType.includes('wetland')) { mood = "eerie green mist"; texture = "mud and dark water"; }
                    if (areaType.includes('desert')) { mood = "harsh bright sunlight"; texture = "sand dunes and cracked earth"; }

                    const battlePrompt = `A top-down tabletop RPG battlemap of [${areaType} wilderness ambush]. ${BATTLEMAP_SUFFIX.replace('[MOOD]', mood).replace('[TEXTURE]', texture)}`;

                    prompts.battlemaps.push({
                        id: `${regSlug}-encounter`,
                        name: `${reg.name} Encounter`,
                        prompt: battlePrompt
                    });


                    // 4. Cities
                    if (reg.cities) {
                        reg.cities.forEach(city => {
                            let cityType = "medieval fortified city";
                            const cd = (city.visualSummary || city.desc).toLowerCase();

                            if (cd.includes('port') || cd.includes('harbor') || cd.includes('havn') || cd.includes('flod')) cityType = "bustling port city";
                            else if (cd.includes('mountain') || cd.includes('stronghold') || cd.includes('bjerg') || cd.includes('mine')) cityType = "mountain stronghold";
                            else if (cd.includes('crystal') || cd.includes('spire') || cd.includes('krystal') || cd.includes('tårn')) cityType = "mystical crystal spire city";
                            else if (cd.includes('swamp') || cd.includes('mud')) cityType = "stilted swamp city";
                            else if (cd.includes('desert') || cd.includes('sand')) cityType = "desert stone city";

                            // Extract landmarks from points of interest or rumor
                            let landmarks = "a central market square, a large temple";
                            if (city.pointsOfInterest && city.pointsOfInterest.length > 0) {
                                landmarks = city.pointsOfInterest.join(', ');
                            }

                            // Inject landmarks into suffix
                            const specificCitySuffix = CITY_SUFFIX.replace('[LANDMARKS]', landmarks);

                            const cityPrompt = `A strict top-down orthographic city map of [${cityType}], ${city.layout || "organic layout"}. ${city.visualSummary || ''}. ${specificCitySuffix}`;

                            const citySlug = city.name.toLowerCase()
                                .replace(/æ/g, 'ae')
                                .replace(/ø/g, 'oe')
                                .replace(/å/g, 'aa')
                                .replace(/[^\w\s-]/g, '')
                                .replace(/\s+/g, '-');

                            prompts.cities.push({
                                id: citySlug,
                                name: city.name,
                                prompt: cityPrompt
                            });

                            // 5b. Battlemaps (Urban Encounter for each City)
                            const urbanPrompt = `A top-down tabletop RPG battlemap of [${cityType} street ambush]. ${BATTLEMAP_SUFFIX.replace('[MOOD]', 'torchlit night').replace('[TEXTURE]', 'cobblestone and stone walls')}`;
                            prompts.battlemaps.push({
                                id: `${citySlug}-encounter`,
                                name: `${city.name} Street Fight`,
                                prompt: urbanPrompt
                            });
                        });
                    }
                });
            }
        });
    }
});

fs.writeFileSync(outputPath, JSON.stringify(prompts, null, 2), 'utf8');
console.log(`Generated prompts for: 
- 1 World Map
- ${prompts.sides.length} Side Maps
- ${prompts.continents.length} Continents
- ${prompts.regions.length} Regions
- ${prompts.cities.length} Cities
- ${prompts.battlemaps.length} Battlemaps`);
