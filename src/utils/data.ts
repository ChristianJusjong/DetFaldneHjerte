
import loreData from '../data/lore.json';
import type { LoreData } from '../types';

// Centralized type casting to ensure the rest of the app gets clean types
// The JSON file is large and TS inference can sometimes fail or result in generic objects
export const getLore = (): LoreData => {
    return loreData as unknown as LoreData;
};
