export type AssetType = 'shop' | 'npc' | 'guard' | 'location' | 'landmark';

export interface InventoryItem {
    name: string;
    price: string;
    desc?: string;
    rarity?: 'common' | 'uncommon' | 'rare' | 'legendary' | 'artifact';
    image?: string;
}

export interface Asset {
    id: string;
    name: string;
    type: AssetType;
    subtype?: string;
    desc: string;
    image?: string;
    tokenImage?: string;
    interiorImage?: string;
    owner?: string;
    inventory?: InventoryItem[];
    shopkeeper?: {
        name: string;
        desc: string;
        quirk?: string;
        image?: string;
    };
    role?: string;
    wants?: string;
    appearance?: string;
    stats?: {
        str: number;
        dex: number;
        con: number;
        int: number;
        wis: number;
        cha: number;
    };
}

export interface District {
    id: string;
    name: string;
    desc: string;
    image?: string;
    mapImage?: string;
    assets: Asset[];
}

export interface City {
    name: string;
    desc: string;
    rumor?: string;
    layout?: string;
    districts: District[];
    coordinates?: { x: number; y: number };
    image?: string;
    mapImage?: string;
    battlemapImage?: string;
    architecture?: string;
    atmosphere?: string;
    pointsOfInterest?: string[];
}

// Legacy interfaces
export interface Shop extends Asset {
    type: 'shop';
}
export interface Npc extends Asset {
    type: 'npc';
}

export interface Region {
    name: string;
    capital: string;
    desc: string;
    battlemapImage?: string;
    coordinates?: { x: number; y: number };
    cities: City[];
}

export interface Race {
    id: string;
    name: string;
    description: string;
    mechanic: string;
    reskin?: string;
    motto?: string;
    image?: string;
}

export interface SocialDynamics {
    conflict?: string;
    magic?: string;
    food?: string;
    trade?: string;
    danger?: string;
    economy?: string;
    weather?: string;
    environment?: string;
    feature?: string;
    cycle?: string;
}

export interface Continent {
    id: string;
    name: string;
    title: string;
    description: string;
    culturalQuote?: string;
    color: string;
    coordinates?: { x: number; y: number };
    socialDynamics?: SocialDynamics;
    races: Race[];
    regions: Region[];
}

export interface Plane {
    id: string;
    name: string;
    theme: string;
    description?: string;
    mapImage?: string;
    continents: Continent[];
}

export interface God {
    id: string;
    name: string;
    domain: string;
    symbol: string;
    followers?: string;
    desc?: string;
    image?: string;
}

export interface Religion {
    name: string;
    description?: string;
    gods: God[];
}

export interface Faction {
    id: string;
    name: string;
    leader: string;
    goal: string;
    assets?: string;
    desc?: string;
}

export interface ConflictEffect {
    name: string;
    desc: string;
}

export interface Conflict {
    id: string;
    title: string;
    description: string;
    effects?: ConflictEffect[];
    fractions: Faction[];
    image?: string;
}

export interface Organization {
    id: string;
    name: string;
    desc: string;
    loyalty: string;
    image?: string;
}

export interface BestiaryEntry {
    id: string;
    name: string;
    desc: string;
    ability: string;
    image?: string;
}

export interface TravelMethod {
    name: string;
    desc: string;
    cost?: string;
}

export interface LoreData {
    worldName: string;
    description: string;
    planes: Plane[];
    conflict: Conflict;
    organizations?: Organization[];
    bestiary?: BestiaryEntry[];
    travel: TravelMethod[];
    religion: Religion;
}
