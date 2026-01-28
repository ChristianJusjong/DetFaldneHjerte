try {
    const fs = require('fs');
    const path = 'c:/ClaudeCodeProject/Det faldne hjerte/src/data/lore.json';
    const content = fs.readFileSync(path, 'utf8');
    JSON.parse(content);
    console.log("JSON is valid");
} catch (e) {
    console.log("JSON is INVALID: " + e.message);
}
