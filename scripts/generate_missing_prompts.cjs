const fs = require('fs');
const path = require('path');
const templates = require('./prompt_templates.cjs');

const reportPath = path.join(__dirname, '../src/data/missing_assets_report.json');
const outputPath = path.join(__dirname, '../src/data/generated_prompts.json');

if (!fs.existsSync(reportPath)) {
    console.error('No missing assets report found. Run verifyImages.cjs first.');
    process.exit(1);
}

const missingAssets = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const prompts = [];

console.log(`Generating prompts for ${missingAssets.length} missing assets...`);

missingAssets.forEach(asset => {
    let prompt = "";
    const d = asset.data;

    try {
        switch (asset.type) {
            case 'god':
                prompt = templates.god(d.name, d.domain, d.symbol);
                break;
            case 'emblem':
                prompt = templates.emblem(d.name, d.desc || "Fantasy Faction");
                break;
            case 'side_map':
                prompt = templates.maps.side.prompt;
                break;
            case 'continent_map':
                // infer biome from description since it's not passed explicitly
                const cDesc = (d.visualSummary || d.description || "").toLowerCase();
                let biome = "temperate";
                if (cDesc.includes('ice') || cDesc.includes('snow')) biome = "frozen tundra";
                if (cDesc.includes('desert') || cDesc.includes('sand')) biome = "arid desert";
                prompt = templates.maps.continent(biome, d.visualSummary || d.description || "");
                break;
            case 'region_map':
                const rDesc = (d.visualSummary || d.desc || "").toLowerCase();
                let areaType = "wilderness";
                if (rDesc.includes('forest')) areaType = "ancient forest";
                if (rDesc.includes('mount')) areaType = "mountainous peaks";
                prompt = templates.maps.region(areaType, d.visualSummary || d.desc || "");
                break;
            case 'city_map':
                const ciDesc = (d.visualSummary || d.desc || "").toLowerCase();
                let cityType = "medieval city";
                if (ciDesc.includes('water') || ciDesc.includes('port')) cityType = "port city";
                prompt = templates.maps.city(cityType, d.layout || "organic", d.visualSummary || "", d.landmarks || "market square");
                break;
            case 'battlemap':
                prompt = templates.maps.battlemap(d.context, "dramatic lighting", "varied terrain");
                break;
            case 'portrait':
                prompt = templates.portrait(d.race || "Human", d.role || "Character", d.appearance || "", d.description || "");
                break;
            case 'item':
                prompt = templates.item(d.name, d.desc || "");
                break;
            case 'interior':
                prompt = templates.interior("Shop", d.atmosphere || "cozy");
                break;
            case 'scenic':
                prompt = templates.scenic(d.name, d.atmosphere || "mysterious", d.architecture || "fantasy");
                break;
            default:
                console.warn(`Unknown asset type: ${asset.type} for ${asset.path}`);
        }

        if (prompt) {
            prompts.push({
                id: asset.path, // Use path as unique ID for file mapping
                filename: path.basename(asset.path),
                prompt: prompt,
                context: asset.context
            });
        }
    } catch (e) {
        console.error(`Error generating prompt for ${asset.path}:`, e.message);
    }
});

fs.writeFileSync(outputPath, JSON.stringify(prompts, null, 2), 'utf8');
console.log(`Successfully generated ${prompts.length} prompts to ${outputPath}`);
