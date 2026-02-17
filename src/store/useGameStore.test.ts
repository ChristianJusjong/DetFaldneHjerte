import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameStore } from './useGameStore';
import type { Bookmark, Combatant } from '../types';

// Mock persist middleware to avoid actual localStorage usage during tests if needed,
// but usually jsdom handles localStorage fine. We just need to clear it.

describe('useGameStore', () => {
    beforeEach(() => {
        // Reset store state before each test
        const { result } = renderHook(() => useGameStore());
        act(() => {
            result.current.clearCombatants();
            result.current.clearRecentSearches();
            // We might need a reset function in the store for testing, 
            // or we can just manually reset fields we touch.
            // For now, let's just reset what we use.
        });
        localStorage.clear();
    });

    describe('Bookmarks', () => {
        it('adds and removes bookmarks', () => {
            const { result } = renderHook(() => useGameStore());
            const bookmark: Bookmark = { url: '/test', title: 'Test Page', type: 'other' };

            act(() => {
                result.current.addBookmark(bookmark);
            });

            expect(result.current.bookmarks).toContainEqual(bookmark);
            expect(result.current.isBookmarked('/test')).toBe(true);

            act(() => {
                result.current.removeBookmark('/test');
            });

            expect(result.current.bookmarks).not.toContainEqual(bookmark);
            expect(result.current.isBookmarked('/test')).toBe(false);
        });

        it('prevents duplicate bookmarks', () => {
            const { result } = renderHook(() => useGameStore());
            const bookmark: Bookmark = { url: '/test', title: 'Test Page', type: 'other' };

            act(() => {
                result.current.addBookmark(bookmark);
                result.current.addBookmark(bookmark);
            });

            expect(result.current.bookmarks.length).toBe(1);
        });
    });

    describe('Combatants', () => {
        it('manages combatants and sorting', () => {
            const { result } = renderHook(() => useGameStore());
            const c1: Combatant = { id: '1', name: 'Goblin', initiative: 10, hp: 7, maxHp: 7, ac: 12, type: 'monster' };
            const c2: Combatant = { id: '2', name: 'Hero', initiative: 20, hp: 10, maxHp: 10, ac: 15, type: 'player' };

            act(() => {
                result.current.addCombatant(c1);
                result.current.addCombatant(c2);
            });

            // Auto-sorts on add?
            // "addCombatant: (c) => set((state) => ({ combatants: [...state.combatants, c].sort((a, b) => b.initiative - a.initiative) }))"
            // Yes, it auto-sorts.
            expect(result.current.combatants[0].id).toBe('2'); // Hero (20)
            expect(result.current.combatants[1].id).toBe('1'); // Goblin (10)

            act(() => {
                result.current.updateCombatant('1', { hp: 5 });
            });
            expect(result.current.combatants.find(c => c.id === '1')?.hp).toBe(5);

            act(() => {
                result.current.removeCombatant('1');
            });
            expect(result.current.combatants.length).toBe(1);
        });
    });

    describe('Recent Searches', () => {
        it('limits recent searches to 5', () => {
            const { result } = renderHook(() => useGameStore());

            act(() => {
                result.current.addRecentSearch('1');
                result.current.addRecentSearch('2');
                result.current.addRecentSearch('3');
                result.current.addRecentSearch('4');
                result.current.addRecentSearch('5');
                result.current.addRecentSearch('6');
            });

            expect(result.current.recentSearches.length).toBe(5);
            expect(result.current.recentSearches[0]).toBe('6'); // Most recent first
        });

        it('moves duplicate search to top', () => {
            const { result } = renderHook(() => useGameStore());

            act(() => {
                result.current.addRecentSearch('A');
                result.current.addRecentSearch('B');
                result.current.addRecentSearch('A');
            });

            expect(result.current.recentSearches.length).toBe(2);
            expect(result.current.recentSearches[0]).toBe('A');
            expect(result.current.recentSearches[1]).toBe('B');
        });
    });

    describe('Settings', () => {
        it('toggles sound', () => {
            const { result } = renderHook(() => useGameStore());
            const initial = result.current.soundEnabled;

            act(() => {
                result.current.toggleSound();
            });
            expect(result.current.soundEnabled).toBe(!initial);
        });

        it('sets volume', () => {
            const { result } = renderHook(() => useGameStore());

            act(() => {
                result.current.setVolume(0.8);
            });
            expect(result.current.volume).toBe(0.8);
        });
    });
});
