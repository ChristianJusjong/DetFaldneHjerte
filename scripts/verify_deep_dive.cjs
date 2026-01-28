const fs = require('fs');

try {
    const data = JSON.parse(fs.readFileSync('src/data/lore.json', 'utf8'));
    console.log('JSON is valid.');

    // Navigate to Spejl-Søen
    const spejlSoeen = data.planes[0].continents[1];
    console.log(`Continent: ${spejlSoeen.name}`);

    const prismeRingen = spejlSoeen.regions[0];
    console.log(`Region: ${prismeRingen.name}`);

    // Check Regnbuen
    const regnbuen = prismeRingen.cities[0];
    console.log(`City 1: ${regnbuen.name}`);

    const morixShop = regnbuen.districts[0].assets.find(a => a.id === 'glimt-i-jet');
    if (morixShop && morixShop.owner === 'Morix') {
        console.log('MATCH: Morix shop updated.');
        console.log(`Desc: ${morixShop.desc}`);
    } else {
        console.log('FAIL: Morix shop not found or incorrect.');
    }

    const draosNPC = regnbuen.districts[0].assets.find(a => a.id === 'draos');
    if (draosNPC && draosNPC.desc.includes('knuste sit eget spejlbillede')) {
        console.log('MATCH: Draos NPC updated.');
    } else {
        console.log('FAIL: Draos NPC not updated.');
    }

    // Check Glimt
    const glimt = prismeRingen.cities[1];
    console.log(`City 2: ${glimt.name}`);

    const libraryShop = glimt.districts[0].assets.find(a => a.id === 'refleksioner');
    if (libraryShop && libraryShop.name === 'Det Glemte Bibliotek') {
        console.log('MATCH: Library shop updated.');
    } else {
        console.log('FAIL: Library shop not found or incorrect.');
    }

    // Navigate to Klang-Dalene (likely index 2 or later, need to find it by name)
    const klangDalene = data.planes[0].continents.find(c => c.name === 'Klang-Dalene');
    if (klangDalene) {
        console.log(`Continent: ${klangDalene.name}`);
        const laeKysten = klangDalene.regions.find(r => r.name === 'Læ-Kysten');
        if (laeKysten) {
            const raabeHavn = laeKysten.cities[0];
            console.log(`City: ${raabeHavn.name}`);

            const genklang = raabeHavn.districts[0].assets.find(a => a.id === 'genklang');
            if (genklang && genklang.desc.includes('lydisolerende mos')) {
                console.log('MATCH: Genklang shop updated.');
            } else {
                console.log('FAIL: Genklang shop not updated.');
            }

            const minaShop = raabeHavn.districts[0].assets.find(a => a.id === 'hvisken');
            if (minaShop && minaShop.owner === 'Mina') {
                console.log('MATCH: Mina/Hvisken shop updated.');
            } else {
                console.log('FAIL: Mina shop not updated.');
            }
        }

        // Find Vind-Stop (Might be in a different region, search continents regions)
        let vindStop = null;
        for (const region of klangDalene.regions) {
            const found = region.cities?.find(c => c.name === 'Vind-Stop');
            if (found) {
                vindStop = found;
                break;
            }
        }

        if (vindStop) {
            console.log(`City: ${vindStop.name}`);
            const stormFangeren = vindStop.districts[0].assets.find(a => a.id === 'storm-fangeren');
            if (stormFangeren && stormFangeren.owner === 'Fenth') {
                console.log('MATCH: Storm-Fangeren updated.');
            } else {
                console.log('FAIL: Storm-Fangeren not found.');
            }
        } else {
            console.log('FAIL: Vind-Stop city not found.');
        }

    } else {
        console.log('FAIL: Klang-Dalene not found.');
    }

    // Navigate to Sølvtunge-Næsset
    const soelvtungeNaesset = data.planes[0].continents.find(c => c.name === 'Sølvtunge-Næsset');
    if (soelvtungeNaesset) {
        console.log(`Continent: ${soelvtungeNaesset.name}`);
        const denSoedeKyst = soelvtungeNaesset.regions.find(r => r.name === 'Den Søde Kyst');

        if (denSoedeKyst) {
            const sukkerHavn = denSoedeKyst.cities.find(c => c.name === 'Sukker-Havn');
            if (sukkerHavn) {
                console.log(`City: ${sukkerHavn.name}`);
                const marcipan = sukkerHavn.districts[0].assets.find(a => a.id === 'borgmester-marcipan');
                if (marcipan && marcipan.desc.includes('fortryllet sukker')) {
                    console.log('MATCH: Borgmester Marcipan found.');
                } else {
                    console.log('FAIL: Borgmester Marcipan not found or incorrect.');
                }
            }

            const ambrosia = denSoedeKyst.cities.find(c => c.name === 'Ambrosia');
            if (ambrosia) {
                console.log(`City: ${ambrosia.name} (renamed from Karamel)`);
                const laenkeSmedjen = ambrosia.districts[0].assets.find(a => a.id === 'laenke-smedjen');
                if (laenkeSmedjen) {
                    console.log('MATCH: Lænke-Smedjen found.');
                } else {
                    console.log('FAIL: Lænke-Smedjen not found.');
                }
            } else {
                console.log('FAIL: Ambrosia city not found (Karamel rename failed?).');
            }
        } else {
            console.log('FAIL: Den Søde Kyst region not found.');
        }

    } else {
        console.log('FAIL: Sølvtunge-Næsset not found.');
    }

} catch (e) {
    console.error('JSON Error:', e.message);
}
