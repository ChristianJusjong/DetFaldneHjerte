import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SearchModal } from '../../components/SearchModal';
import { useGameStore } from '../../store/useGameStore';

// Mock dependencies
vi.mock('../../hooks/useSoundEffects', () => ({
    useSoundEffects: () => ({
        playClick: vi.fn(),
        playHover: vi.fn(),
    })
}));

// Mock Data for Search
vi.mock('../../utils/data', () => ({
    getLore: () => ({
        worldName: 'Test World',
        planes: [{
            id: 'plane1',
            continents: [{
                id: 'cont1',
                name: 'TestContinent',
                title: 'The Land',
                regions: [{
                    name: 'TestRegion',
                    desc: 'A region',
                    cities: [{ name: 'IntegrateCity', desc: 'A city for integration testing' }]
                }],
                races: []
            }]
        }],
        religion: { gods: [] },
        organizations: [],
        travel: []
    })
}));

describe('SearchFlow Integration', () => {
    beforeEach(() => {
        const store = useGameStore.getState();
        store.clearRecentSearches();
        store.setSearchOpen(true); // Open it for testing
        store.setDMScreenOpen(false);
        localStorage.clear();
    });

    it('searches for a city and adds to recent history', async () => {
        render(
            <MemoryRouter>
                <SearchModal />
            </MemoryRouter>
        );

        // 1. Verify modal is open (input exists)
        const input = screen.getByPlaceholderText('Søg i visdommen...');
        expect(input).toBeInTheDocument();

        // 2. Type search term
        fireEvent.change(input, { target: { value: 'IntegrateCity' } });

        // 3. Verify results appear
        // Using findByText to wait for any potential async/state updates, though useMemo is sync.
        const resultItem = await screen.findByText('IntegrateCity');
        expect(resultItem).toBeInTheDocument();

        // 4. Click result
        fireEvent.click(resultItem);

        // 5. Verify flow: 
        // - Modal should close
        // - Item should be in recent searches
        const store = useGameStore.getState();

        expect(store.isSearchOpen).toBe(false);
        expect(store.recentSearches).toContain('IntegrateCity');
    });

    it('navigates through recent searches', async () => {
        // Pre-populate recent searches using the store
        const store = useGameStore.getState();
        store.addRecentSearch('OldSearch');

        render(
            <MemoryRouter>
                <SearchModal />
            </MemoryRouter>
        );

        // Verify recent search is displayed when query is empty
        expect(screen.getByText('OldSearch')).toBeInTheDocument();

        // Click it
        fireEvent.click(screen.getByText('OldSearch'));

        // It should populate the search box
        const input = screen.getByPlaceholderText('Søg i visdommen...') as HTMLInputElement;
        expect(input.value).toBe('OldSearch');
    });
});
