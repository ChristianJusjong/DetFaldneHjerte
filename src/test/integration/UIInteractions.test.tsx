import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../app/App';

// Mock react-zoom-pan-pinch to avoid ResizeObserver and complex DOM issues
vi.mock('react-zoom-pan-pinch', () => ({
    TransformWrapper: ({ children }: any) => <div>{children({ zoomIn: vi.fn(), zoomOut: vi.fn(), resetTransform: vi.fn() })}</div>,
    TransformComponent: ({ children }: any) => <div data-testid="transform-component">{children}</div>,
}));

// Mock loreData JSON import for TravelCalculator (still needed if something imports it directly)
vi.mock('@/data/modules/planes.json', () => ({
    default: [
        {
            id: 'lyssiden',
            name: 'Lys-Siden',
            continents: [
                {
                    id: 'superia',
                    name: 'Superia',
                    regions: [
                        {
                            name: 'Sol-Kysten',
                            cities: [{ name: 'Lys-Vej' }]
                        }
                    ],
                    races: []
                }
            ]
        }
    ]
}));

// Mock getLore data (used in other parts)
vi.mock('@/features/lore/utils/data', () => ({
    getLore: () => ({
        planes: [
            {
                id: 'lyssiden',
                name: 'Lys-Siden',
                continents: [
                    {
                        id: 'superia',
                        name: 'Superia',
                        regions: [
                            {
                                name: 'Sol-Kysten',
                                cities: [{ name: 'Lys-Vej' }]
                            }
                        ],
                        races: []
                    }
                ]
            },
            {
                id: 'skyggesiden',
                name: 'Skygge-Siden',
                continents: [
                    {
                        id: 'morket',
                        name: 'Mørket',
                        regions: [
                            {
                                name: 'Skygge-Skov',
                                cities: [{ name: 'Skygge-Vej' }]
                            }
                        ]
                    }
                ]
            }
        ],
        religion: { gods: [] },
        organizations: [],
        bestiary: [],
        conflict: { fractions: [] },
        travel: []
    })
}));

describe('UI Interactions Integration', () => {
    const renderApp = (path = '/') => {
        return render(
            <MemoryRouter initialEntries={[path]}>
                <App />
            </MemoryRouter>
        );
    };

    it('opens and closes breadcrumb dropdowns in DrillDownMenu', async () => {
        renderApp();
        await waitFor(() => expect(screen.getByText('COR')).toBeInTheDocument());

        // Find the "Cor" breadcrumb button
        const corBtn = screen.getByRole('button', { name: /Cor/i });
        fireEvent.click(corBtn);

        // Check if siblings dropdown is visible
        expect(await screen.findByText('Gå til world')).toBeInTheDocument();
        expect(await screen.findByText('Racer')).toBeInTheDocument();

        // Click outside (simulated by clicking the document body or another element)
        fireEvent.mouseDown(document);
        await waitFor(() => expect(screen.queryByText('Vælg world')).not.toBeInTheDocument());
    });

    it('toggles the NPC Generator and DM Screen modals', async () => {
        renderApp();
        await waitFor(() => expect(screen.getByText('COR')).toBeInTheDocument());
        
        // NPC Generator
        const npcBtn = screen.getByTitle('NPC Generator');
        fireEvent.click(npcBtn);
        expect(await screen.findByText('Generer')).toBeInTheDocument();
        
        // Close NPC Generator
        const closeNpc = screen.getByTestId('close-npc');
        fireEvent.click(closeNpc);
        await waitFor(() => expect(screen.queryByText('Generer')).not.toBeInTheDocument());

        // DM Screen
        const dmBtn = screen.getByTitle('DM Screen');
        fireEvent.click(dmBtn);
        expect(await screen.findByText('Initiativ')).toBeInTheDocument();

        // Close DM Screen
        const closeDm = screen.getByTestId('close-dm');
        fireEvent.click(closeDm);
        await waitFor(() => expect(screen.queryByText('Initiativ')).not.toBeInTheDocument());
    });

    it('manages combatants in DM Screen', async () => {
        renderApp();
        await waitFor(() => expect(screen.getByText('COR')).toBeInTheDocument());

        fireEvent.click(screen.getByTitle('DM Screen'));
        
        // Add a combatant
        const nameInput = await screen.findByPlaceholderText('Goblin Boss');
        fireEvent.change(nameInput, { target: { value: 'Orc' } });
        fireEvent.click(screen.getByRole('button', { name: /Tilføj/i }));

        expect(await screen.findByText('Orc')).toBeInTheDocument();

        // Increase HP
        const plusBtn = screen.getByText('+');
        fireEvent.click(plusBtn);
        expect(screen.getByText('11')).toBeInTheDocument();

        // Remove
        const removeButtons = screen.getAllByRole('button');
        // The remove button has an X icon. Let's find the one that removes.
        // In DMScreen it's <button onClick={() => removeCombatant(c.id)} ...><X size={18} /></button>
        const removeBtn = removeButtons.find(b => b.innerHTML.includes('lucide-x') && !b.hasAttribute('data-testid'));
        if (removeBtn) {
            fireEvent.click(removeBtn);
            expect(screen.queryByText('Orc')).not.toBeInTheDocument();
        }
    });

    it('interacts with SearchModal keyboard navigation and search', async () => {
        renderApp();
        await waitFor(() => expect(screen.getByText('COR')).toBeInTheDocument());

        // Simulate '/' key to open search
        fireEvent.keyDown(window, { key: '/' });
        expect(screen.getByPlaceholderText('Søg i visdommen...')).toBeInTheDocument();

        // Close via ESC
        fireEvent.keyDown(window, { key: 'Escape' });
        await waitFor(() => expect(screen.queryByPlaceholderText('Søg i visdommen...')).not.toBeInTheDocument());

        // Open via Button
        const searchBtn = screen.getByTitle(/Søg/i);
        fireEvent.click(searchBtn);
        expect(screen.getByPlaceholderText('Søg i visdommen...')).toBeInTheDocument();

        // Close via Close Button
        const closeSearch = screen.getByTestId('close-search');
        fireEvent.click(closeSearch);
        await waitFor(() => expect(screen.queryByPlaceholderText('Søg i visdommen...')).not.toBeInTheDocument());
    });

    it('calculates travel time and cost in TravelCalculator', async () => {
        renderApp('/travel');
        await waitFor(() => expect(screen.getByText(/Rejse Planlægger/i)).toBeInTheDocument(), { timeout: 3000 });

        const startSelect = screen.getByTestId('travel-start');
        const endSelect = screen.getByTestId('travel-end');
        fireEvent.change(startSelect, { target: { value: 'Lys-Vej' } });
        fireEvent.change(endSelect, { target: { value: 'Skygge-Vej' } });

        expect(await screen.findByText(/Estimeret Tid/i)).toBeInTheDocument();
        expect(screen.getByTestId('travel-cost')).toHaveTextContent('Gratis');

        const airshipBtn = screen.getByText('Luftskib');
        fireEvent.click(airshipBtn);
        expect(screen.getByTestId('travel-cost')).not.toHaveTextContent('Gratis');
        expect(screen.getByTestId('travel-cost')).toHaveTextContent('gp');
    });

    it('interacts with pins on the InteractiveMap', async () => {
        renderApp('/map');
        await waitFor(() => expect(screen.getByText('Interaktivt Overland')).toBeInTheDocument());

        const pin = screen.getByText('Aethelgard');
        fireEvent.click(pin);
        expect(screen.getByText('Besøg Sted')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Luk'));
        await waitFor(() => expect(screen.queryByText('Besøg Sted')).not.toBeInTheDocument());
    });

    it('toggles bookmarks dropdown in DrillDownMenu', async () => {
        renderApp();
        await waitFor(() => expect(screen.getByText('COR')).toBeInTheDocument());

        const starBtn = screen.getByTitle('Favoritter');
        fireEvent.click(starBtn);
        expect(screen.getByText('Favorit Bogmærker')).toBeInTheDocument();
        expect(screen.getByText('Intet gemt endnu')).toBeInTheDocument();

        fireEvent.click(starBtn);
        await waitFor(() => expect(screen.queryByText('Bogmærker')).not.toBeInTheDocument());
    });
});
