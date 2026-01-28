const fs = require('fs');
const path = require('path');

const PROMPTS_PATH = path.join(__dirname, '../src/data/image_prompts.json');
const prompts = JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf8'));

const newPrompts = [
    {
        "id": "tanke-kollektivet",
        "name": "Tanke-Kollektivet",
        "type": "Organization",
        "context": "Global",
        "prompt": "fantasy art, Organization, Tanke-Kollektivet..." // Prompt doesn't strictly matter for linking, just ID
    },
    {
        "id": "guld-lauget",
        "name": "Guld-Lauget",
        "type": "Organization",
        "context": "Global",
        "prompt": "fantasy art..."
    },
    {
        "id": "ur-stammen",
        "name": "Ur-Stammen",
        "type": "Organization",
        "context": "Global",
        "prompt": "fantasy art..."
    },
    {
        "id": "fantom-oprret",
        "name": "Fantom-Oprøret",
        "type": "Organization",
        "context": "Global",
        "prompt": "fantasy art..."
    }
];

// Add if not exists
newPrompts.forEach(np => {
    if (!prompts.find(p => p.id === np.id)) {
        prompts.push(np);
        console.log(`Added ${np.name}`);
    }
});

fs.writeFileSync(PROMPTS_PATH, JSON.stringify(prompts, null, 2));
