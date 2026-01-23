export type AssetType = 'shop' | 'npc' | 'guard' | 'location' | 'landmark';

export interface InventoryItem {
    name: string;
    price: string;
    desc?: string;
    rarity?: 'common' | 'uncommon' | 'rare' | 'legendary' | 'artifact';
    image?: string; // New: Item Card Art
}

export interface Asset {
    id: string; // Unique identifier for routing
    name: string;
    type: AssetType; // "shop", "npc", etc.
    subtype?: string; // "Blacksmith", "Captain of the Guard"
    desc: string;
    image?: string; // Specific image for this asset (Portrait for NPC, Exterior for Shop)
    tokenImage?: string; // New: VTT Token for NPC
    interiorImage?: string; // New: Interior view for Shop/Location
    // Shop specific
    owner?: string;
    inventory?: InventoryItem[];
    shopkeeper?: {
        name: string;
        desc: string;
        quirk?: string;
        image?: string; // New: Shopkeeper Portrait
    };
    // NPC specific
    role?: string;
    wants?: string;
    appearance?: string; // Visual description
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
    id: string; // URL-friendly ID
    name: string;
    desc: string;
    image?: string; // Scenic image
    mapImage?: string; // Orthographic map
    assets: Asset[];
}

export interface City {
    name: string;
    desc: string;
    rumor?: string;
    layout?: string;
    // shops?: Shop[]; // DEPRECATED: usage migrated to districts
    // inhabitants?: Npc[]; // DEPRECATED: usage migrated to districts
    districts: District[]; // NEW: container for all content
    image?: string; // Scenic image of the city
    mapImage?: string; // Orthographic map
    battlemapImage?: string; // Encounter map
    // Descriptive extensions
    architecture?: string;
    atmosphere?: string;
    pointsOfInterest?: string[];
}

// Keeping old interfaces for backward compatibility during migration if needed, 
// but strictly they should be replaced by Asset.
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
    battlemapImage?: string; // Encounter map
    cities: City[];
}

export interface Race {
    id: string; // New
    name: string;
    description: string;
    mechanic: string;
    reskin?: string;
    motto?: string;
    image?: string; // Standardize image
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
    culturalQuote?: string; // Added field
    color: string;
    socialDynamics?: SocialDynamics;
    races: Race[];
    regions: Region[];
}

export interface Plane {
    id: string;
    name: string;
    theme: string;
    description?: string;
    mapImage?: string; // New field
    continents: Continent[];
}

export interface God {
    id: string; // New
    name: string;
    domain: string;
    symbol: string;
    followers?: string;
    desc?: string; // Standardize desc
    image?: string; // Standardize image
}

export interface Religion {
    name: string;
    description?: string;
    gods: God[];
}

export interface Faction {
    id: string; // New
    name: string;
    leader: string;
    goal: string;
    assets?: string;
    desc?: string; // Standardize
}

export interface ConflictEffect {
    name: string;
    desc: string;
}

export interface Conflict {
    id: string; // New
    title: string;
    description: string;
    effects?: ConflictEffect[];
    fractions: Faction[];
    image?: string;
}

export interface Organization {
    id: string; // New
    name: string;
    desc: string;
    loyalty: string;
    image?: string;
}

export interface BestiaryEntry {
    id: string; // New
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

export interface Bookmark {
    url: string;
    title: string;
    type: 'continent' | 'region' | 'city' | 'district' | 'asset' | 'other';
}

export interface GeneratedNPC {
    id: string;
    name: string;
    race: string;
    role: string;
    quirk: string;
    continent: string;
    description: string; // Added description
    alignment?: string; // Added alignment
    stats: {
        str: number;
        dex: number;
        con: number;
        int: number;
        wis: number;
        cha: number;
    };
    notes?: string;
    createdAt: number;
}

export interface Combatant {
    id: string;
    name: string;
    initiative: number;
    hp: number;
    maxHp: number;
    ac: number;
    type: 'player' | 'monster' | 'npc';
    condition?: string;
}
