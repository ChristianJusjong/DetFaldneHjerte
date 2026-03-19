const { execSync } = require('child_process');

async function runAllBatches() {
    let hasMore = true;
    while (hasMore) {
        console.log("\nStarting next batch of 10...");
        try {
            // Run the batch script synchronously
            const output = execSync('node scripts/generate_missing_banana_batch.cjs', { encoding: 'utf-8' });
            console.log(output);

            // If the output says "No missing images found", we are done!
            if (output.includes("No missing images found")) {
                hasMore = false;
                console.log("All missing images generated successfully!");
            } else {
                // Wait between batches to not overload the API or PC
                console.log("Batch finished. Waiting 10 seconds before next batch...");
                await new Promise(r => setTimeout(r, 10000));
            }
        } catch (error) {
            console.error("Batch script encountered an error:", error.stdout || error.message);
            console.log("Waiting 30 seconds before retrying due to error...");
            await new Promise(r => setTimeout(r, 30000));
        }
    }
}

runAllBatches();
