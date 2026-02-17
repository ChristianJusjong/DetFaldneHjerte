import { describe, it, expect, vi } from 'vitest';
import { searchLore } from './search';

// Mock the data module
vi.mock('./data', () => ({
    getLore: () => ({
        worldName: 'Test World',
        description: 'A test world',
        planes: [
            {
                id: 'plane-1',
                name: 'Material Plane',
                theme: 'Normal',
                continents: [
                    {
                        id: 'cont-1',
                        name: 'Test Continent',
                        title: 'The Testing Grounds',
                        description: 'A place for testing.',
                        color: '#ffffff',
                        races: [{ name: 'Human', description: 'Basic humans', mechanic: 'Standard' }],
                        regions: [
                            {
                                name: 'Test Region',
                                capital: 'Test City',
                                desc: 'A region',
                                cities: [
                                    { name: 'Test City', desc: 'A city', districts: [], assets: [] }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        religion: {
            name: 'Pantheon',
            gods: [
                { id: 'god-1', name: 'Test God', domain: 'Testing', symbol: 'T' }
            ]
        },
        organizations: [
            { id: 'org-1', name: 'Test Org', desc: 'An org', loyalty: 'High' }
        ],
        conflict: {
            id: 'con-1',
            title: 'The Conflict',
            description: 'War',
            fractions: []
        },
        travel: []
    })
}));

describe('searchLore', () => {
    // Fuse.js has internal state/caching, so we might need to reset or just rely on fresh imports if possible.
    // However, since searchLore uses a module-level variable `fuseInstance`, it persists across tests in the same file.
    // This is fine as long as data doesn't change.

    it('returns empty array for empty query', () => {
        expect(searchLore('')).toEqual([]);
        expect(searchLore('   ')).toEqual([]);
    });

    it('finds a continent by name', () => {
        const results = searchLore('Test Continent');
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].title).toBe('Test Continent');
        expect(results[0].type).toBe('continent');
    });

    it('finds a god by name', () => {
        const results = searchLore('Test God');
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].title).toBe('Test God');
        expect(results[0].type).toBe('god');
    });

    it('filters by type', () => {
        const results = searchLore('Test', 'god');
        // Should find God but NOT Continent
        const godStart = results.find(r => r.type === 'god');
        const contStart = results.find(r => r.type === 'continent');

        expect(godStart).toBeDefined();
        expect(contStart).toBeUndefined();
    });

    it('returns nothing for non-matching query', () => {
        const results = searchLore('NonExistentTermXYZ');
        expect(results).toEqual([]);
    });
});
