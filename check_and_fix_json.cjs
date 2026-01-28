const fs = require('fs');
const path = 'c:/ClaudeCodeProject/Det faldne hjerte/src/data/lore.json';
let content = fs.readFileSync(path, 'utf8');

// Strip BOM if present
if (content.charCodeAt(0) === 0xFEFF) {
    console.log("Removing BOM...");
    content = content.slice(1);
    fs.writeFileSync(path, content, 'utf8');
}

try {
    JSON.parse(content);
    console.log("JSON is valid");
} catch (e) {
    console.log("JSON is INVALID: " + e.message);
    // Print the last few chars to see if it's truncated
    console.log("Last 20 chars: [" + content.slice(-20) + "]");
}
