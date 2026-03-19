import { getLore } from './data';
import { slugify } from '@/shared/utils/helpers';

interface TermCandidate {
    url: string;
    type: string;
    continentId?: string;
    regionId?: string;
    // Add priority or length for sorting if needed, but we handle that in logic
}

let termMap: Map<string, TermCandidate[]> | null = null;
let masterRegex: RegExp | null = null;
let sortedTermsCache: string[] = [];

const initializeEngine = () => {
    if (termMap) return;

    const data = getLore();
    const map = new Map<string, TermCandidate[]>();

    const addTerm = (term: string, candidate: TermCandidate) => {
        if (!term) return;
        // Normalize term? Optional. For now assuming exact match case-insensitive will be handled by regex flag.
        const existing = map.get(term) || [];
        existing.push(candidate);
        map.set(term, existing);
    };

    // --- Indexing Logic (Copied and refined from SmartLink) ---

    // Planes & Continents
    data.planes.forEach(p => {
        if (p.name) addTerm(p.name, { url: `/plane/${p.id}`, type: 'plane' });

        p.continents?.forEach(c => {
            if (c.name) addTerm(c.name, { url: `/continent/${c.id}`, type: 'continent', continentId: c.id });

            // Races
            c.races?.forEach(r => {
                if (r.name) addTerm(r.name, { url: `/lore/race/${r.id || slugify(r.name)}`, type: 'race', continentId: c.id });
            });

            // Regions
            c.regions?.forEach(reg => {
                if (reg.name) addTerm(reg.name, { url: `/continent/${c.id}/${slugify(reg.name)}`, type: 'region', continentId: c.id, regionId: slugify(reg.name) });

                // Cities
                reg.cities?.forEach(city => {
                    if (city.name) {
                        addTerm(city.name, {
                            url: `/continent/${c.id}/${slugify(reg.name)}/${slugify(city.name)}`,
                            type: 'city',
                            continentId: c.id,
                            regionId: slugify(reg.name)
                        });
                    }
                });
            });
        });
    });

    // Gods
    data.religion.gods.forEach(g => {
        if (g.name) {
            const name = g.name.split(' (')[0];
            addTerm(name, { url: `/lore/god/${g.id || slugify(g.name)}`, type: 'god' });
        }
    });

    // Organizations
    data.organizations?.forEach(o => {
        if (o.name) addTerm(o.name, { url: `/lore/organization/${o.id || slugify(o.name)}`, type: 'org' });
    });

    // Bestiary
    data.bestiary?.forEach(b => {
        if (b.name) addTerm(b.name, { url: `/lore/bestiary/${b.id || slugify(b.name)}`, type: 'bestiary' });
    });

    termMap = map;

    // Create Regex
    // Sort by length desc to match longest first ("High Elf" before "Elf")
    sortedTermsCache = Array.from(map.keys()).sort((a, b) => b.length - a.length);

    if (sortedTermsCache.length > 0) {
        const pattern = sortedTermsCache.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        masterRegex = new RegExp(`\\b(${pattern})\\b`, 'gi');
    }
};

export const getSmartTokens = (text: string) => {
    if (!termMap) initializeEngine();
    if (!text || !masterRegex) return [text];

    // Split keeps the capture groups in the result array
    return text.split(masterRegex);
};

export const getTermData = (term: string) => {
    if (!termMap) initializeEngine();
    // We need to find the key in a case-insensitive way because the regex is 'gi'
    // But the map keys are original case.
    // Optimization: The regex match `term` comes from the text, so case might differ.
    // map.get(term) relies on exact match.
    // We need a lookup.

    // Fast lookup: We know 'term' matched one of the map keys case-insensitively.
    // We can just iterate sortedTermsCache or use a lower-case map.
    // Let's optimize by creating a lowercase map during init?
    // Actually, let's keep it simple for now: find the key.

    const key = sortedTermsCache.find(k => k.toLowerCase() === term.toLowerCase());
    return key ? termMap!.get(key) : null;
};
