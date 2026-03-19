const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyA78sXIBvfQlyU8Pr8Wgi_HMkdmv74hETI';
const MODEL = 'gemini-2.5-flash-image';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

async function testGenerate() {
    console.log('Sending request to', URL);

    const payload = {
        contents: [{ parts: [{ text: "A strict top-down orthographic city map of [medieval fortified city], Bunkers gravet ned i saltet.. Settlement located in Det Hvide Øde. Aesthetic: Fantasy landscape with distinct magical features. Layout: Huse lavet af envejs-spejle... View from directly above (90 degrees). Visible rooftops of houses, distinct cobblestone streets. Clear landmarks: Det lokale marked, Vagttårnet, Kroen 'Den Hurtige Hvil'. Sunlit, high contrast. No perspective or isometric." }] }]
    };

    try {
        const res = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('API Error:', res.status, errorText);
            return;
        }

        const data = await res.json();
        if (data.candidates && data.candidates[0].content.parts[0].inlineData) {
            const b64 = data.candidates[0].content.parts[0].inlineData.data;
            const outPath = path.join(__dirname, '../public/assets/cities/posten.png');
            fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
            console.log('Successfully generated and saved to', outPath);
        } else {
            console.log("No inline image data found.", JSON.stringify(data, null, 2));
        }

    } catch (err) {
        console.error('Request failed:', err);
    }
}

testGenerate();
