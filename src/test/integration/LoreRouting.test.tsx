import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LoreEntityPage } from '../../pages/LoreEntityPage';

// Mock getLore data
vi.mock('../../features/lore/utils/data', () => ({
    getLore: () => ({
        planes: [
            {
                id: 'lyssiden',
                continents: [
                    {
                        id: 'superia',
                        name: 'Superia',
                        races: [
                            { id: 'human', name: 'Menneske', description: 'A common race' }
                        ]
                    }
                ]
            }
        ],
        religion: {
            gods: [
                { id: 'sol', name: 'Sol (The Sun)', domain: 'Light', symbol: 'Sun disk' }
            ]
        },
        organizations: [
            { id: 'mages', name: 'Mage Guild', desc: 'A guild of mages', loyalty: 'Neutral' }
        ],
        bestiary: [
            { id: 'dragon', name: 'Dragon', desc: 'A big fire breathing lizard' }
        ],
        conflict: {
            name: 'The Great War',
            desc: 'A big war',
            fractions: [
                { id: 'empire', name: 'The Empire', leader: 'Emperor', goal: 'Control' }
            ]
        }
    })
}));

describe('Lore Routing Integration', () => {
    const renderLorePage = (type: string, id: string) => {
        return render(
            <MemoryRouter initialEntries={[`/lore/${type}/${id}`]}>
                <Routes>
                    <Route path="/lore/:type/:id" element={<LoreEntityPage />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('renders a race lore page', () => {
        renderLorePage('race', 'human');
        expect(screen.getByText('Menneske')).toBeInTheDocument();
        expect(screen.getByText('RACE')).toBeInTheDocument();
        expect(screen.getByText('A common race')).toBeInTheDocument();
    });

    it('renders a god lore page', () => {
        renderLorePage('god', 'sol');
        expect(screen.getByText('Sol (The Sun)')).toBeInTheDocument();
        expect(screen.getByText('GUDDOM')).toBeInTheDocument();
        expect(screen.getByText('Light')).toBeInTheDocument();
    });

    it('renders an organization lore page', () => {
        renderLorePage('organization', 'mages');
        expect(screen.getByText('Mage Guild')).toBeInTheDocument();
        expect(screen.getByText('ORGANISATION')).toBeInTheDocument();
        expect(screen.getByText('A guild of mages')).toBeInTheDocument();
    });

    it('renders a bestiary lore page', () => {
        renderLorePage('bestiary', 'dragon');
        expect(screen.getByText('Dragon')).toBeInTheDocument();
        expect(screen.getByText('BÆST')).toBeInTheDocument();
        expect(screen.getByText('A big fire breathing lizard')).toBeInTheDocument();
    });

    it('renders a conflict faction lore page', () => {
        renderLorePage('conflict', 'empire');
        expect(screen.getByText('The Empire')).toBeInTheDocument();
        expect(screen.getByText('FRAKTION')).toBeInTheDocument();
    });

    it('renders "not found" message for invalid entity', () => {
        renderLorePage('race', 'non-existent');
        expect(screen.getByText('Ingen optegnelser fundet...')).toBeInTheDocument();
    });
});
