import { useState, useMemo } from 'react';
import { Plane, Map as MapIcon, Footprints, ArrowRight } from 'lucide-react';
import { MysticCard } from './ui/MysticCard';
import type { LoreData } from '../types';
import loreData from '../data/lore.json';

// Flatten cities for easier selection
const getAllCities = (data: LoreData) => {
    return data.planes.flatMap(plane =>
        plane.continents.flatMap(cont =>
            cont.regions.flatMap(reg =>
                reg.cities.map(city => ({
                    id: city.name, // Use name as ID for simplicity in this calculator
                    name: city.name,
                    region: reg.name,
                    continent: cont.name
                }))
            )
        )
    );
};

const TRAVEL_METHODS = [
    { id: 'walk', name: 'Til Fods', speed: 24, costPerMile: 0, icon: Footprints, desc: 'Gratis, men langsomt og farligt.' },
    { id: 'cart', name: 'Heste-vogn', speed: 40, costPerMile: 0.1, icon: ArrowRight, desc: 'Sikrere rejse på vejene.' },
    { id: 'airship', name: 'Luftskib', speed: 150, costPerMile: 2, icon: Plane, desc: 'Hurtig og luksuriøs transport mellem storbyer.' },
    { id: 'teleport', name: 'Teleport Cirkel', speed: 99999, costPerMile: 10, icon: MapIcon, desc: 'Øjeblikkelig rejse for de rige.' },
];

export const TravelCalculator = () => {
    const cities = useMemo(() => getAllCities(loreData as unknown as LoreData), []);
    const [start, setStart] = useState<string>('');
    const [end, setEnd] = useState<string>('');
    const [method, setMethod] = useState<string>('walk');

    // Pseudo-random distance calculator based on name hash to be consistent but "fake"
    // In a real app, this would use coordinates.
    const getDistance = (c1: string, c2: string) => {
        if (!c1 || !c2 || c1 === c2) return 0;
        const hash = (c1 + c2).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return (hash % 500) + 50; // Random distance between 50 and 550 miles
    };

    const distance = useMemo(() => getDistance(start, end), [start, end]);
    const selectedMethod = TRAVEL_METHODS.find(m => m.id === method);

    const cost = Math.floor(distance * (selectedMethod?.costPerMile || 0));
    const timeHours = distance / (selectedMethod?.speed || 1);
    const timeString = timeHours > 24
        ? `${Math.floor(timeHours / 24)} dage, ${Math.floor(timeHours % 24)} timer`
        : `${Math.floor(timeHours)} timer`;

    return (
        <MysticCard className="bg-black/40 border border-white/10 p-6">
            <h3 className="text-xl font-bold text-yellow-500 mb-6 flex items-center gap-2">
                <MapIcon /> Rejse Planlægger
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-bold text-text-dim mb-2 uppercase">Fra</label>
                    <select
                        value={start}
                        onChange={e => setStart(e.target.value)}
                        className="w-full bg-black/60 border border-white/20 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                    >
                        <option value="">Vælg startpunkt...</option>
                        {cities.map(c => <option key={c.id} value={c.id}>{c.name} ({c.continent})</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-text-dim mb-2 uppercase">Til</label>
                    <select
                        value={end}
                        onChange={e => setEnd(e.target.value)}
                        className="w-full bg-black/60 border border-white/20 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                    >
                        <option value="">Vælg destination...</option>
                        {cities.map(c => <option key={c.id} value={c.id}>{c.name} ({c.continent})</option>)}
                    </select>
                </div>
            </div>

            <div className="mb-8">
                <label className="block text-sm font-bold text-text-dim mb-4 uppercase">Rejsemetode</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {TRAVEL_METHODS.map(m => (
                        <button
                            key={m.id}
                            onClick={() => setMethod(m.id)}
                            className={`p-4 rounded-xl border text-left transition-all group ${method === m.id
                                ? 'bg-yellow-500/20 border-yellow-500 text-white'
                                : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-400'
                                }`}
                        >
                            <div className={`flex items-center gap-2 mb-2 ${method === m.id ? 'text-yellow-500' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                <m.icon size={20} />
                                <span className="font-bold">{m.name}</span>
                            </div>
                            <p className="text-xs opacity-70">{m.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            {start && end && start !== end && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-6 bg-gradient-to-r from-yellow-900/20 to-black rounded-2xl border border-yellow-500/30 flex flex-col md:flex-row justify-between items-center gap-6">

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-500/20 rounded-full text-yellow-500">
                                {selectedMethod?.icon && <selectedMethod.icon size={32} />}
                            </div>
                            <div>
                                <div className="text-sm text-yellow-500/70 uppercase font-bold tracking-wider">Estimeret Tid</div>
                                <div className="text-3xl font-serif text-white">{timeString}</div>
                            </div>
                        </div>

                        <div className="hidden md:block w-px h-16 bg-white/10" />

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-sm text-yellow-500/70 uppercase font-bold tracking-wider">Afstand</div>
                                <div className="text-xl text-gray-300">{Math.floor(distance)} miles</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-yellow-500/70 uppercase font-bold tracking-wider">Pris</div>
                                <div className="text-3xl font-serif text-white">{cost > 0 ? `${cost} gp` : 'Gratis'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MysticCard>
    );
};
