// Modular Data Imports
import meta from '../data/modules/meta.json';
import planes from '../data/modules/planes.json';
import religion from '../data/modules/religion.json';
import bestiary from '../data/modules/bestiary.json';
import organizations from '../data/modules/organizations.json';
import conflict from '../data/modules/conflict.json';
import travel from '../data/modules/travel.json';

import type { LoreData } from '../types';

// Aggregation
const aggregatedLore: LoreData = {
    ...meta,
    planes: planes as any,
    religion: religion as any,
    bestiary: bestiary as any,
    organizations: organizations as any,
    conflict: conflict as any,
    travel: travel as any
};

export const getLore = (): LoreData => {
    return aggregatedLore;
};
