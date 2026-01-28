const fs = require('fs');
const path = require('path');

const LORE_PATH = path.join(__dirname, '../src/data/lore.json');
const content = fs.readFileSync(LORE_PATH, 'utf8');
const lines = content.split('\n');

const targets = ['"name": "Ankeret"', '"name": "Bitter-Sumpen"'];

targets.forEach(target => {
    lines.forEach((line, index) => {
        if (line.includes(target)) {
            console.log(`Found ${target} at line ${index + 1}`);
            // Print few lines context
            for (let i = 0; i < 5; i++) {
                console.log(`${index + 1 + i}: ${lines[index + i]}`);
            }
        }
    });
});
