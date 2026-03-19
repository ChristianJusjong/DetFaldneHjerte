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
    description: string;
    alignment?: string;
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
