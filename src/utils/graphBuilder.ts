import { getLore } from './data';
import type { LoreData } from '../types';

export interface GraphNode {
    id: string;
    name: string;
    group: string; // 'god', 'plane', 'city', 'org'
    val: number; // Size based on importance
    color?: string;
}

export interface GraphLink {
    source: string;
    target: string;
    value: number; // strength
}

export const buildLoreGraph = () => {
    const data: LoreData = getLore();
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    // 1. Planes (Centers)
    data.planes.forEach(plane => {
        nodes.push({ id: plane.id, name: plane.name, group: 'plane', val: 20, color: '#a855f7' }); // Purple

        // Continents
        plane.continents.forEach(cont => {
            const contId = `cont-${cont.name}`;
            nodes.push({ id: contId, name: cont.name, group: 'continent', val: 10, color: '#3b82f6' }); // Blue
            links.push({ source: plane.id, target: contId, value: 5 });

            // Regions & Cities
            cont.regions.forEach(region => {
                region.cities.forEach(city => {
                    const cityId = `city-${city.name}`;
                    nodes.push({ id: cityId, name: city.name, group: 'city', val: 5, color: '#10b981' }); // Emerald
                    links.push({ source: contId, target: cityId, value: 3 });
                });
            });

            // Races
            cont.races?.forEach(race => {
                const raceId = `race-${race.name}`;
                nodes.push({ id: raceId, name: race.name, group: 'race', val: 5, color: '#f59e0b' }); // Amber
                links.push({ source: contId, target: raceId, value: 3 });
            });
        });
    });

    // 2. Gods
    data.religion.gods.forEach(god => {
        const godId = `god-${god.name}`;
        nodes.push({ id: godId, name: god.name, group: 'god', val: 15, color: '#eab308' }); // Yellow
    });

    // 3. Organizations
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orgs = Array.isArray(data.organizations) ? data.organizations : (data.organizations as any).factions || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    orgs.forEach((org: any) => {
        const orgId = `org-${org.name}`;
        nodes.push({ id: orgId, name: org.name, group: 'org', val: 8, color: '#ef4444' }); // Red
    });

    return { nodes, links };
};
