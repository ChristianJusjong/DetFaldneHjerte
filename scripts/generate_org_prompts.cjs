const fs = require('fs');
const path = require('path');

const lorePath = path.join(__dirname, '../src/data/lore.json');
const outputPath = path.join(__dirname, '../src/data/org_prompts.json');
const loreData = JSON.parse(fs.readFileSync(lorePath, 'utf8'));

// Organization Prompt Template
const ORG_PROMPT_TEMPLATE = "Concept art of the symbol or emblem for [ORG_NAME]. [DESCRIPTION]. Minimalist fantasy icon, high contrast, suitable for a flag or shield. White background, vector style art. --ar 1:1 --v 6.0 --no text, realistic photo, complex background";

const prompts = {
    organizations: []
};

if (loreData.organizations) {
    loreData.organizations.forEach(org => {
        const slug = org.image.split('/').pop().replace('.png', '');

        // Enrich description with visualSummary if available
        let desc = org.visualSummary || org.description;
        // Clean up description for prompt
        desc = desc.replace(/\n/g, ' ').substring(0, 300);

        const prompt = ORG_PROMPT_TEMPLATE
            .replace('[ORG_NAME]', org.name)
            .replace('[DESCRIPTION]', desc);

        prompts.organizations.push({
            id: slug,
            name: org.name,
            prompt: prompt
        });
    });
}

fs.writeFileSync(outputPath, JSON.stringify(prompts, null, 2), 'utf8');
console.log(`Generated ${prompts.organizations.length} organization prompts.`);
