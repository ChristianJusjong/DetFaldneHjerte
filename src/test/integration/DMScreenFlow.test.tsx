import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DMScreen } from '@/features/dm-tools/components/DMScreen';
import { useGameStore } from '@/app/store/useGameStore';

// Mock dependencies
vi.mock('../../hooks/useSoundEffects', () => ({
    useSoundEffects: () => ({
        playClick: vi.fn(),
        playSuccess: vi.fn(),
        playHover: vi.fn(),
    })
}));

// Mock complex sub-components
vi.mock('../../components/tools/BattleMap', () => ({
    BattleMap: () => <div data-testid="battle-map">Map</div>
}));
vi.mock('../../components/tools/AmbientMixer', () => ({
    AmbientMixer: () => <div>Mixer</div>
}));

// We need to mock MysticCard if it has complex children or context, but usually it's just a wrapper.
// Let's assume it renders children.

describe('DMScreenFlow Integration', () => {
    beforeEach(() => {
        const store = useGameStore.getState();
        store.clearCombatants();
        store.setDMScreenOpen(true); // Open it
        store.setWeather('clear');
        localStorage.clear();
    });

    it('adds a combatant and updates HP', () => {
        render(<DMScreen />);

        // 1. Verify screen is open and on Initiative tab (default)
        expect(screen.getByText('Initiativ')).toBeInTheDocument();

        // 2. Add Combatant
        const nameInput = screen.getByPlaceholderText('Goblin Boss');
        fireEvent.change(nameInput, { target: { value: 'Test Orc' } });

        // Click Add (Tilføj)
        const addButton = screen.getByRole('button', { name: /Tilføj/i });
        fireEvent.click(addButton);

        // 3. Verify in list
        expect(screen.getByText('Test Orc')).toBeInTheDocument();

        // Verify in store
        const store = useGameStore.getState();
        expect(store.combatants).toHaveLength(1);
        expect(store.combatants[0].name).toBe('Test Orc');

        // 4. Update HP
        // The accessible name might be tricky. The code has buttons `+` and `-`.
        // They are inside the list item. We can find by text.
        const minusBtn = screen.getByText('-');
        fireEvent.click(minusBtn);

        // 5. Verify UI update
        // Initial HP defaults to 10 in the component state if not specified (and we didn't specify).
        // <span className="...">9</span>/10 HP
        // We look for text '9' which might be ambiguous if other things correspond to 9, but in this isolated test it's likely fine.
        expect(screen.getByText('9')).toBeInTheDocument();

        // Verify store
        expect(useGameStore.getState().combatants[0].hp).toBe(9);
    });

    it('changes weather and updates store', () => {
        render(<DMScreen />);

        // 1. Switch to Weather tab
        const weatherTab = screen.getByRole('button', { name: /Vejr/i });
        fireEvent.click(weatherTab);

        // 2. Click a weather option e.g. "Regn"
        const rainBtn = screen.getByRole('button', { name: 'Regn' });
        fireEvent.click(rainBtn);

        // 3. Verify store update
        expect(useGameStore.getState().weather).toBe('rain');

        // 4. Verify UI active state (class check or other indicator)
        // The button should have active classes.
        // We can check if getByRole('button', {name: 'Regn'}) has a class or if we just trust the store update.
        // Store update is sufficient for integration test of flow.
    });
});
