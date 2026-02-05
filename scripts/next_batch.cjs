const fs = require('fs');
const path = require('path');

const promptsPath = path.join(__dirname, '../src/data/image_prompts.json');
const publicDir = path.join(__dirname, '../public');

if (!fs.existsSync(promptsPath)) {
    console.error('generated_prompts.json not found');
    process.exit(1);
}

const allPrompts = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
const queue = [];

for (const p of allPrompts) {
    const fullPath = path.join(publicDir, p.targetPath);
    if (!fs.existsSync(fullPath)) {
        queue.push(p);
    }
    if (queue.length >= 5) break;
}

console.log(JSON.stringify(queue, null, 2));
