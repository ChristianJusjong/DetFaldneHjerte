
const Jimp = require('jimp');
const fs = require('fs');

async function stitchMaps() {
    console.log("Starting map stitching...");

    const CONTINENT_DIR = 'src/assets/maps/continents';
    const OUTPUT_DIR = 'src/assets/maps/sides';

    // Helper to load image safely
    async function load(name) {
        const path = `${CONTINENT_DIR}/${name}.png`;
        if (fs.existsSync(path)) {
            console.log(`Loading ${name}...`);
            return await Jimp.read(path);
        } else {
            console.error(`Missing: ${path}`);
            return null;
        }
    }

    // --- LYS-SIDEN ---
    try {
        const skyBg = new Jimp(2400, 1800, '#d0e8f0'); // Light Blue Sky

        const tanke = await load('tanke-tinderne');
        const spejl = await load('spejl-soeen');
        const klang = await load('klang-dalene');
        const soelv = await load('soelvtunge-naesset');

        if (tanke) {
            tanke.resize(800, Jimp.AUTO);
            skyBg.composite(tanke, 800, 50); // Top Center
        }
        if (spejl) {
            spejl.resize(900, Jimp.AUTO);
            skyBg.composite(spejl, 750, 600); // Center
        }
        if (klang) {
            klang.resize(700, Jimp.AUTO);
            skyBg.composite(klang, 100, 1000); // Bottom Left
        }
        if (soelv) {
            soelv.resize(700, Jimp.AUTO);
            skyBg.composite(soelv, 1500, 1000); // Bottom Right
        }

        // Add label (simulated optional text or just save)
        console.log("Saving lyssiden.png...");
        await skyBg.writeAsync(`${OUTPUT_DIR}/lyssiden.png`);
    } catch (e) {
        console.error("Error creating Lys-Siden:", e);
    }

    // --- SKYGGE-SIDEN ---
    try {
        const voidBg = new Jimp(2400, 1800, '#1a1a2e'); // Dark Void

        const tvilling = await load('tvillinge-oerne');
        const ur = await load('ur-skoven');
        const slam = await load('slam-sumpen');

        if (tvilling) {
            tvilling.resize(800, Jimp.AUTO);
            voidBg.composite(tvilling, 200, 100); // Top Left
        }
        if (ur) {
            ur.resize(900, Jimp.AUTO);
            voidBg.composite(ur, 750, 800); // Bottom Center
        }
        if (slam) {
            slam.resize(800, Jimp.AUTO);
            voidBg.composite(slam, 1400, 200); // Top Right
        }

        console.log("Saving skyggesiden.png...");
        await voidBg.writeAsync(`${OUTPUT_DIR}/skyggesiden.png`);

    } catch (e) {
        console.error("Error creating Skygge-Siden:", e);
    }

    console.log("Done!");
}

stitchMaps();
