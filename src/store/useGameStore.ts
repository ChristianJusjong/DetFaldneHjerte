import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Bookmark, GeneratedNPC, Combatant } from '../types';

interface GameState {
    // Bookmarks
    bookmarks: Bookmark[];
    addBookmark: (bookmark: Bookmark) => void;
    removeBookmark: (url: string) => void;
    isBookmarked: (url: string) => boolean;

    // Saved NPCs
    savedNPCs: GeneratedNPC[];
    saveNPC: (npc: GeneratedNPC) => void;
    deleteNPC: (id: string) => void;

    // Initiative Tracker
    combatants: Combatant[];
    addCombatant: (combatant: Combatant) => void;
    removeCombatant: (id: string) => void;
    updateCombatant: (id: string, updates: Partial<Combatant>) => void;
    sortCombatants: () => void;
    clearCombatants: () => void;

    // UI State
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
    toggleSidebar: () => void;

    // Tools State
    isNPCGeneratorOpen: boolean;
    setNPCGeneratorOpen: (isOpen: boolean) => void;
    isDMScreenOpen: boolean;
    setDMScreenOpen: (isOpen: boolean) => void;
    isSearchOpen: boolean;
    setSearchOpen: (isOpen: boolean) => void;
    recentSearches: string[];
    addRecentSearch: (term: string) => void;
    clearRecentSearches: () => void;

    // Settings
    soundEnabled: boolean;
    toggleSound: () => void;
    volume: number; // 0.0 to 1.0
    setVolume: (vol: number) => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            // Bookmarks
            bookmarks: [],
            addBookmark: (bookmark) => set((state) => {
                if (state.bookmarks.some(b => b.url === bookmark.url)) return state;
                return { bookmarks: [...state.bookmarks, bookmark] };
            }),
            removeBookmark: (url) => set((state) => ({
                bookmarks: state.bookmarks.filter(b => b.url !== url)
            })),
            isBookmarked: (url) => get().bookmarks.some(b => b.url === url),

            // Saved NPCs
            savedNPCs: [],
            saveNPC: (npc) => set((state) => {
                if (state.savedNPCs.some(n => n.id === npc.id)) return state;
                return { savedNPCs: [...state.savedNPCs, npc] };
            }),
            deleteNPC: (id) => set((state) => ({
                savedNPCs: state.savedNPCs.filter(n => n.id !== id)
            })),

            // Initiative Tracker
            combatants: [],
            addCombatant: (c) => set((state) => ({
                combatants: [...state.combatants, c].sort((a, b) => b.initiative - a.initiative)
            })),
            removeCombatant: (id) => set((state) => ({
                combatants: state.combatants.filter(c => c.id !== id)
            })),
            updateCombatant: (id, updates) => set((state) => ({
                combatants: state.combatants.map(c => c.id === id ? { ...c, ...updates } : c)
            })),
            sortCombatants: () => set((state) => ({
                combatants: [...state.combatants].sort((a, b) => b.initiative - a.initiative)
            })),
            clearCombatants: () => set({ combatants: [] }),

            // UI State
            isSidebarOpen: true, // Default open on desktop
            setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
            toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

            // Tools State
            isNPCGeneratorOpen: false,
            setNPCGeneratorOpen: (isOpen) => set({ isNPCGeneratorOpen: isOpen }),
            isDMScreenOpen: false,
            setDMScreenOpen: (isOpen) => set({ isDMScreenOpen: isOpen }),
            isSearchOpen: false,
            setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),

            // Search History
            recentSearches: [],
            addRecentSearch: (term) => set((state) => {
                const newRecent = [term, ...state.recentSearches.filter(t => t !== term)].slice(0, 5);
                return { recentSearches: newRecent };
            }),
            clearRecentSearches: () => set({ recentSearches: [] }),

            // Settings
            soundEnabled: true,
            toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
            volume: 0.5,
            setVolume: (vol) => set({ volume: vol }),
        }),
        {
            name: 'dfh_storage', // Shared storage key
            partialize: (state) => ({
                bookmarks: state.bookmarks,
                savedNPCs: state.savedNPCs,
                combatants: state.combatants,
                recentSearches: state.recentSearches,
                soundEnabled: state.soundEnabled,
                volume: state.volume
            }), // Only persist these fields
        }
    )
);
