import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TravelCalculator } from './TravelCalculator';

// Mock the lore data
vi.mock('../data/lore.json', () => ({
    default: {
        planes: [
            {
                continents: [
                    {
                        name: 'TestContinent',
                        regions: [
                            {
                                name: 'TestRegion',
                                cities: [
                                    { name: 'CityA', desc: 'Desc A', districts: [], assets: [] },
                                    { name: 'CityB', desc: 'Desc B', districts: [], assets: [] }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
}));

// Mock Sound Effects
vi.mock('../hooks/useSoundEffects', () => ({
    useSoundEffects: () => ({
        playClick: vi.fn(),
        playSuccess: vi.fn(),
        playHover: vi.fn(),
    })
}));

describe('TravelCalculator', () => {
    it('renders city options', () => {
        render(<TravelCalculator />);

        // Check for Select options
        const startSelect = screen.getAllByRole('combobox')[0]; // First Select is Start
        expect(startSelect).toBeInTheDocument();

        // Options should be populated
        expect(screen.getAllByText('CityA (TestContinent)').length).toBeGreaterThan(0);
        expect(screen.getAllByText('CityB (TestContinent)').length).toBeGreaterThan(0);
    });

    it('calculates travel on selection', () => {
        render(<TravelCalculator />);

        const selects = screen.getAllByRole('combobox');
        const startSelect = selects[0];
        const endSelect = selects[1];

        fireEvent.change(startSelect, { target: { value: 'CityA' } });
        fireEvent.change(endSelect, { target: { value: 'CityB' } });

        // Distance and result should appear
        expect(screen.getByText(/Estimeret Tid/i)).toBeInTheDocument();
        expect(screen.getByText(/Afstand/i)).toBeInTheDocument();
    });

    it('updates cost when method changes', () => {
        render(<TravelCalculator />);

        const selects = screen.getAllByRole('combobox');
        fireEvent.change(selects[0], { target: { value: 'CityA' } });
        fireEvent.change(selects[1], { target: { value: 'CityB' } });

        // Default is 'Til Fods' (Walk) -> Cost: Gratis (0 gp)
        // Check initial state
        expect(screen.getByText('Gratis')).toBeInTheDocument();

        // Change method to 'Heste-vogn' (Cart) -> Cost > 0
        const cartButton = screen.getByText('Heste-vogn');
        fireEvent.click(cartButton);

        // Expect cost to update (not free anymore)
        // The exact value depends on the hashed distance, but it shouldn't be "Gratis"
        expect(screen.queryByText('Gratis')).not.toBeInTheDocument();
        expect(screen.getByText(/gp/i)).toBeInTheDocument();
    });
});
