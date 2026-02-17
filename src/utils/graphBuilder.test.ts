import { describe, it, expect, vi } from 'vitest';
import { buildLoreGraph } from './graphBuilder';

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

describe('buildLoreGraph', () => {
    it('generates nodes and links', () => {
        const graph = buildLoreGraph();
        expect(graph.nodes).toBeDefined();
        expect(graph.links).toBeDefined();
        expect(graph.nodes.length).toBeGreaterThan(0);
        expect(graph.links.length).toBeGreaterThan(0);
    });

    it('creates plane nodes with correct group', () => {
        const graph = buildLoreGraph();
        const planeNode = graph.nodes.find(n => n.group === 'plane');
        expect(planeNode).toBeDefined();
        expect(planeNode?.name).toBe('Material Plane');
        expect(planeNode?.id).toBe('plane-1');
    });

    it('creates god nodes with correct group', () => {
        const graph = buildLoreGraph();
        const godNode = graph.nodes.find(n => n.group === 'god');
        expect(godNode).toBeDefined();
        expect(godNode?.name).toBe('Test God');
    });

    it('links plane to continent', () => {
        const graph = buildLoreGraph();
        // Planes are centers, continents link to planes
        const link = graph.links.find(l => l.source === 'plane-1' && l.target === 'cont-Test Continent');
        expect(link).toBeDefined();
    });
});
