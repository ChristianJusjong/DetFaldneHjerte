
const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
    const fileStream = fs.createReadStream('src/data/lore.json');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineNumber = 0;
    for await (const line of rl) {
        lineNumber++;
        if (line.includes('"name":')) console.log(`${lineNumber}: ${line.trim()}`);
    }
}

processLineByLine();
