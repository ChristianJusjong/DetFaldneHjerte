// Modular Data Imports
import meta from '../data/modules/meta.json';
import planes from '../data/modules/planes.json';
import religion from '../data/modules/religion.json';
import bestiary from '../data/modules/bestiary.json';
import organizations from '../data/modules/organizations.json';
import conflict from '../data/modules/conflict.json';
import travel from '../data/modules/travel.json';

import type {
    LoreData,
    Plane,
    Religion,
    BestiaryEntry,
    Organization,
    Conflict,
    TravelMethod
} from '../types';

// Aggregation
const aggregatedLore: LoreData = {
    ...meta,
    planes: planes as unknown as Plane[],
    religion: religion as unknown as Religion,
    bestiary: bestiary as unknown as BestiaryEntry[],
    organizations: organizations as unknown as Organization[],
    conflict: conflict as unknown as Conflict,
    travel: travel as unknown as TravelMethod[]
};

/**
 * @deprecated Use specific async getters (e.g., getPlanes) to reduce bundle size in future updates.
 */
export const getLore = (): LoreData => {
    return aggregatedLore;
};

// Async Getters for Data Splitting (Lazy Loading)
export const getPlanes = async (): Promise<Plane[]> => {
    const module = await import('../data/modules/planes.json');
    return module.default as unknown as Plane[];
};

export const getBestiary = async (): Promise<BestiaryEntry[]> => {
    const module = await import('../data/modules/bestiary.json');
    return module.default as unknown as BestiaryEntry[];
};

export const getOrganizations = async (): Promise<Organization[]> => {
    const module = await import('../data/modules/organizations.json');
    return module.default as unknown as Organization[];
};

export const getConflict = async (): Promise<Conflict> => {
    const module = await import('../data/modules/conflict.json');
    return module.default as unknown as Conflict;
};

