const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyA78sXIBvfQlyU8Pr8Wgi_HMkdmv74hETI';
const MODEL = 'gemini-2.5-flash-image';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
const PUBLIC_DIR = path.join(__dirname, '../public');
const PROMPTS_PATH = path.join(__dirname, '../src/data/generated_prompts.json');

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
                console.warn('Rate limited (429), waiting 15s before retry...');
                await new Promise(r => setTimeout(r, 15000));
                return generateImage(prompt, outPath); // retry
            }
            const errorText = await res.text();
            console.error(`API Error for ${path.basename(outPath)}:`, res.status, errorText);
            return false;
        }

        const data = await res.json();
        let inlineB64 = null;
        if (data.candidates) {
            for (const cand of data.candidates) {
                if (cand.content && cand.content.parts) {
                    for (const part of cand.content.parts) {
                        if (part.inlineData && part.inlineData.data) {
                            inlineB64 = part.inlineData.data;
                            break;
                        }
                    }
                }
                if (inlineB64) break;
            }
        }

        if (inlineB64) {
            fs.mkdirSync(path.dirname(outPath), { recursive: true });
            fs.writeFileSync(outPath, Buffer.from(inlineB64, 'base64'));
            console.log(`Successfully saved -> ${outPath}`);

            // Append to task.md
            const taskPath = 'C:\\Users\\christian.jusjong\\.gemini\\antigravity\\brain\\1bb6aa20-8e70-4927-bfdd-3921478b36bb\\task.md';
            if (fs.existsSync(taskPath)) {
                fs.appendFileSync(taskPath, `- [x] Generated: ${path.basename(outPath)}\n`);
            }

            return true;
        } else {
            console.error(`No inline image data found for ${path.basename(outPath)}.`);
            if (data.promptFeedback) {
                console.error("Prompt Feedback:", JSON.stringify(data.promptFeedback, null, 2));
            }
            if (data.candidates && data.candidates[0].finishReason) {
                console.error("Finish Reason:", data.candidates[0].finishReason);
                for (const cand of data.candidates) {
                    if (cand.content && cand.content.parts) {
                        for (const part of cand.content.parts) {
                            if (part.text) {
                                console.error("Text Response:", part.text);
                            }
                        }
                    }
                }
            }
            return false;
        }
    } catch (err) {
        console.error(`Request failed for ${path.basename(outPath)}:`, err.message);
        return false;
    }
}

async function runBatch(batchSize = 10) {
    if (!fs.existsSync(PROMPTS_PATH)) {
        console.error('Could not find generated_prompts.json');
        return;
    }

    // Read and parse all prompts
    const allPrompts = JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf8'));

    // Sort prompts by ID/path to ensure structured processing
    allPrompts.sort((a, b) => a.id.localeCompare(b.id));

    // Load skipped list if exists
    const skippedPath = path.join(__dirname, '../src/data/skipped_prompts.json');
    let skippedIDs = [];
    if (fs.existsSync(skippedPath)) {
        skippedIDs = JSON.parse(fs.readFileSync(skippedPath, 'utf8'));
    }

    const queue = [];

    // Find the next batch of missing images
    for (const p of allPrompts) {
        // p.id is the full relative path like "/assets/organizations/ur-stammen.png"
        // remove leading slash if it exists to join correctly with PUBLIC_DIR
        const relativePath = p.id.startsWith('/') ? p.id.slice(1) : p.id;
        const outPath = path.join(PUBLIC_DIR, relativePath);

        if (!fs.existsSync(outPath) && !skippedIDs.includes(p.id)) {
            queue.push({ ...p, outPath });
        }
        if (queue.length >= batchSize) break;
    }

    if (queue.length === 0) {
        console.log("No missing images found! All generated_prompts.json targets exist.");
        return;
    }

    console.log(`Found ${queue.length} missing images for this batch.`);
    console.log(`Starting generation for batch of ${queue.length}...`);

    let successCount = 0;
    const newlySkipped = [];

    // Run sequentially to manage rate limits
    for (const item of queue) {
        console.log(`[Batch Item] Generating: ${item.context || item.filename}...`);

        // ensure dir exists based on the structured path in id
        fs.mkdirSync(path.dirname(item.outPath), { recursive: true });

        const success = await generateImage(item.prompt, item.outPath);
        if (success) {
            successCount++;
        } else {
            newlySkipped.push(item.id);
        }

        // Sleep between requests to respect Gemini API rate limits (~15 RPM on free tier)
        console.log("Waiting 5 seconds before next request...");
        await new Promise(r => setTimeout(r, 5000));
    }

    // Save newly skipped items
    if (newlySkipped.length > 0) {
        skippedIDs.push(...newlySkipped);
        fs.writeFileSync(skippedPath, JSON.stringify(skippedIDs, null, 2));
        console.log(`Added ${newlySkipped.length} failed prompts to skipped_prompts.json.`);
    }

    console.log(`--- Batch Complete ---`);
    console.log(`Generated ${successCount} out of ${queue.length} items successfully.`);
    console.log(`Run this script again to process the next batch of ${batchSize}.`);
}

// Run batch size of 10
runBatch(10);
