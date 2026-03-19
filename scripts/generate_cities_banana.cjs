const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyA78sXIBvfQlyU8Pr8Wgi_HMkdmv74hETI';
const MODEL = 'gemini-2.5-flash-image';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
const PUBLIC_DIR = path.join(__dirname, '../public');

async function generateImage(prompt, outPath) {
    const payload = {
        contents: [{ parts: [{ text: prompt }] }]
    };

    try {
        const res = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            if (res.status === 429) {
                console.warn('Rate limited (429), waiting 10s...');
                await new Promise(r => setTimeout(r, 10000));
                return generateImage(prompt, outPath); // retry
            }
            const errorText = await res.text();
            console.error('API Error:', res.status, errorText);
            return false;
        }

        const data = await res.json();
        if (data.candidates && data.candidates[0].content.parts[0].inlineData) {
            const b64 = data.candidates[0].content.parts[0].inlineData.data;
            fs.mkdirSync(path.dirname(outPath), { recursive: true });
            fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
            console.log('Successfully saved ->', outPath);
            return true;
        } else {
            console.error("No inline image data found.", JSON.stringify(data, null, 2));
            return false;
        }
    } catch (err) {
        console.error('Request failed:', err.message);
        return false;
    }
}

async function run() {
    const promptsPath = path.join(__dirname, '../src/data/map_prompts.json');
    if (!fs.existsSync(promptsPath)) {
        console.error('Could not find map_prompts.json');
        return;
    }
    const mapPrompts = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

    // We want to generate missing cities
    const citiesDir = path.join(PUBLIC_DIR, 'assets/cities');
    fs.mkdirSync(citiesDir, { recursive: true });

    let count = 0;
    for (const city of mapPrompts.cities) {
        // Fallback for targetPath if not defined
        const outPath = city.targetPath ? path.join(PUBLIC_DIR, city.targetPath) : path.join(citiesDir, city.id + '.png');

        if (!fs.existsSync(outPath)) {
            console.log(`[Batch] Generating ${city.id}...`);
            const success = await generateImage(city.prompt, outPath);
            if (success) {
                count++;
            }
            // Sleep for 4 seconds to respect rate limits (assuming ~15 RPM)
            await new Promise(r => setTimeout(r, 4500));
        }
    }
    console.log(`Done! Generated ${count} missing city maps.`);
}

run();
