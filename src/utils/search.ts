import Fuse from 'fuse.js';
import { getLore } from './data';

export interface SearchResult {
    id: string;
    title: string;
    description: string;
    type: 'city' | 'region' | 'continent' | 'god' | 'race' | 'organization' | 'bestiary' | 'other';
    path: string;
}

const getSearchIndex = (): SearchResult[] => {
    const data = getLore();
    const results: SearchResult[] = [];

    // Index Continents
    data.planes.forEach(p => p.continents.forEach(c => {
        results.push({
            id: c.id,
            title: c.name,
            description: c.title,
            type: 'continent',
            path: `/continent/${c.id}`
        });

        // Index Regions
        c.regions.forEach(r => {
            results.push({
                id: r.name,
                title: r.name,
                description: r.desc.substring(0, 100),
                type: 'region',
                path: `/continent/${c.id}/${r.name.toLowerCase().replace(/ /g, '-')}`
            });

            // Index Cities
            r.cities.forEach(city => {
                results.push({
                    id: city.name,
                    title: city.name,
                    description: city.desc.substring(0, 100),
                    type: 'city',
                    path: `/continent/${c.id}/${r.name.toLowerCase().replace(/ /g, '-')}/${city.name.toLowerCase().replace(/ /g, '-')}`
                });
            });
        });

        // Index Races
        c.races.forEach(race => {
            results.push({
                id: race.name,
                title: race.name,
                description: race.description.substring(0, 100),
                type: 'race',
                path: '/races'
            });
        });
    }));

    // Index Gods
    data.religion.gods.forEach(g => {
        results.push({
            id: g.name,
            title: g.name,
            description: `Gud for ${g.domain}`,
            type: 'god',
            path: '/religion'
        });
    });

    // Index Organizations
    data.organizations?.forEach(o => {
        results.push({
            id: o.name,
            title: o.name,
            description: o.desc.substring(0, 100),
            type: 'organization',
            path: '/organizations'
        });
    });

    // Index Lore Pages
    results.push({ id: 'history', title: 'Verdenshistorie', description: 'Skabelsen og de store krige', type: 'other', path: '/' });
    results.push({ id: 'travel', title: 'Rejsemetoder', description: 'Transport i Cor', type: 'other', path: '/travel' });
    results.push({ id: 'conflict', title: 'Protokol Apatia', description: 'Den store magiske sygdom', type: 'other', path: '/conflict' });

    return results;
};

const options = {
    keys: ['title', 'description', 'type'],
    threshold: 0.3, // Fuzzy match sensitivity
    ignoreLocation: true
};

let fuseInstance: Fuse<SearchResult> | null = null;

export const searchLore = (query: string): SearchResult[] => {
    if (!fuseInstance) {
        fuseInstance = new Fuse(getSearchIndex(), options);
    }

    if (!query.trim()) return [];

    return fuseInstance.search(query).map(result => result.item);
};
