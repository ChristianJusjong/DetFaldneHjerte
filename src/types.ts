export interface Shop {
    name: string;
    type: string;
    desc: string;
    owner?: string;
}

export interface Npc {
    name: string;
    role: string;
    desc: string;
    wants?: string;
}

export interface City {
    name: string;
    desc: string;
    rumor?: string;
    layout?: string;
    shops?: Shop[];
    inhabitants?: Npc[];
    mapImage?: string;
}

export interface Region {
    name: string;
    capital: string;
    desc: string;
    cities: City[];
}

export interface Race {
    name: string;
    description: string;
    mechanic: string;
    reskin?: string;
    motto?: string;
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
    continents: Continent[];
}

export interface God {
    name: string;
    domain: string;
    symbol: string;
    followers?: string;
}

export interface Religion {
    name: string;
    description?: string;
    gods: God[];
}

export interface Faction {
    name: string;
    leader: string;
    goal: string;
    assets?: string;
}

export interface ConflictEffect {
    name: string;
    desc: string;
}

export interface Conflict {
    title: string;
    description: string;
    effects?: ConflictEffect[];
    fractions: Faction[];
}

export interface Organization {
    name: string;
    desc: string;
    loyalty: string;
}

export interface BestiaryEntry {
    name: string;
    desc: string;
    ability: string;
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
    type: 'continent' | 'region' | 'city' | 'other';
}

export interface GeneratedNPC {
    id: string;
    name: string;
    race: string;
    role: string;
    quirk: string;
    continent: string;
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
