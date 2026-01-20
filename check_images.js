
import fs from 'fs';
import path from 'path';
// Re-implemented slugify locally
// Actually, let's just re-implement slugify to avoid build/import complexity for this simple check.
const localSlugify = (text) => text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

const lorePath = path.join(process.cwd(), 'src', 'data', 'lore.json');
const assetsPath = path.join(process.cwd(), 'src', 'assets', 'cities');
const rootAssetsPath = path.join(process.cwd(), 'src', 'assets');

try {
    const loreData = JSON.parse(fs.readFileSync(lorePath, 'utf8'));
    const cities = [];

    loreData.planes.forEach(plane => {
        plane.continents.forEach(cont => {
            cont.regions.forEach(region => {
                region.cities.forEach(city => {
                    cities.push({
                        name: city.name,
                        slug: localSlugify(city.name),
                        region: region.name,
                        continent: cont.name
                    });
                });
            });
        });
    });

    console.log(`Found ${cities.length} cities in lore.json.`);

    const missing = [];
    const foundInRoot = [];

    cities.forEach(city => {
        const expectedFile = `${city.slug}.png`;
        const fullPath = path.join(assetsPath, expectedFile);

        if (!fs.existsSync(fullPath)) {
            // Check if it exists in root assets
            const rootPath = path.join(rootAssetsPath, expectedFile);
            if (fs.existsSync(rootPath)) {
                foundInRoot.push(city);
            } else {
                missing.push(city);
            }
        }
    });

    console.log('\n--- Cities found in src/assets (need moving) ---');
    foundInRoot.forEach(c => console.log(`${c.name} (${c.slug}.png)`));

    console.log('\n--- Missing City Images ---');
    missing.forEach(c => console.log(`${c.name} (${c.slug}.png)`));

} catch (err) {
    console.error('Error:', err);
}
