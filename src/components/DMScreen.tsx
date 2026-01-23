import { useState } from 'react';
import { BookOpen, Sword, Dna, Coins, Compass, Clock, RotateCcw, Trash2, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { MysticCard } from './ui/MysticCard';
import type { Combatant } from '../types';

export const DMScreen = ({ showTrigger = true }: { showTrigger?: boolean }) => {
    const { isDMScreenOpen, setDMScreenOpen, combatants, addCombatant, removeCombatant, updateCombatant, sortCombatants, clearCombatants } = useGameStore();
    const { playClick, playSuccess, playHover } = useSoundEffects();
    const [activeTab, setActiveTab] = useState<'initiative' | 'dice' | 'prices' | 'travel' | 'time'>('initiative');

    // ... (rest of logic) ...

    // Since replace_file_content works on chunks, I'll target the props and the return statement trigger.
    // This is a bit tricky with one chunk. Let's do it in two steps or be smart.
    // Actually, I can just replace the definition and the trigger part.
    // But the tool says "single contiguous block". The definition and the return are not contiguous.
    // I'll used multi_replace_file_content if I had it in the allowlist? yes I do.


    // Initiative State
    const [newCombatant, setNewCombatant] = useState<Partial<Combatant>>({ name: '', initiative: 0, hp: 10, maxHp: 10, ac: 10, type: 'monster' });

    const handleAddCombatant = () => {
        if (!newCombatant.name) return;

        addCombatant({
            id: crypto.randomUUID(),
            name: newCombatant.name,
            initiative: Number(newCombatant.initiative) || 0,
            hp: Number(newCombatant.hp) || 10,
            maxHp: Number(newCombatant.maxHp) || Number(newCombatant.hp) || 10,
            ac: Number(newCombatant.ac) || 10,
            type: newCombatant.type as any || 'monster',
            condition: ''
        });

        setNewCombatant({ name: '', initiative: 0, hp: 10, maxHp: 10, ac: 10, type: 'monster' });
        playSuccess();
    };

    const rollInitiative = () => {
        combatants.forEach(c => {
            if (c.type !== 'player') {
                const roll = Math.floor(Math.random() * 20) + 1;
                // Simple dex mod estimation or just raw roll for now
                updateCombatant(c.id, { initiative: roll });
            }
        });
        sortCombatants();
        playClick();
    };

    const tabs = [
        { id: 'initiative', label: 'Kamp', icon: <Sword size={18} /> },
        { id: 'dice', label: 'Terninger', icon: <Dna size={18} /> },
        { id: 'prices', label: 'Handel', icon: <Coins size={18} /> },
        { id: 'travel', label: 'Rejse', icon: <Compass size={18} /> },
        { id: 'time', label: 'Tid', icon: <Clock size={18} /> }
    ];

    // Dice Roller
    const [rollResult, setRollResult] = useState<string | null>(null);
    const rollDice = (sides: number) => {
        const result = Math.floor(Math.random() * sides) + 1;
        setRollResult(`d${sides}: ${result}`);
        playClick();
    };

    return (
        <>
            {showTrigger && (
                <div
                    onClick={() => { setDMScreenOpen(true); playClick(); }}
                    className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-white hover:bg-white/5 transition-all cursor-pointer border-t border-white/10 group"
                    onMouseEnter={() => playHover()}
                >
                    <BookOpen size={18} className="text-superia/60 group-hover:text-superia transition-colors" />
                    <span className="font-serif text-sm">DM Skærm</span>
                </div>
            )}

            <AnimatePresence>
                {isDMScreenOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setDMScreenOpen(false)}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-5xl h-[700px] flex flex-col"
                        >
                            <MysticCard noPadding className="h-full flex flex-col overflow-hidden shadow-2xl border-superia/20">
                                <div className="p-4 border-b border-border bg-black/40 flex justify-between items-center shrink-0">
                                    <div className="flex gap-2 overflow-x-auto pb-1">
                                        {tabs.map(tab => (
                                            <button
                                                key={tab.id}
                                                onClick={() => { setActiveTab(tab.id as any); playClick(); }}
                                                className={`
                                                    flex items-center gap-2 px-4 py-2 rounded-lg font-serif text-sm transition-all whitespace-nowrap
                                                    ${activeTab === tab.id ? 'bg-superia/20 text-superia border border-superia/30' : 'text-text-dim hover:text-white hover:bg-white/5 border border-transparent'}
                                                `}
                                            >
                                                {tab.icon} {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                    <X size={24} className="cursor-pointer text-text-dim hover:text-white hover:scale-110 transition-all ml-4" onClick={() => setDMScreenOpen(false)} />
                                </div>

                                <div className="p-6 overflow-y-auto flex-1 bg-[url('/assets/noise.svg')] bg-opacity-5">
                                    {activeTab === 'initiative' && (
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                                            {/* List */}
                                            <div className="lg:col-span-2 flex flex-col gap-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="font-serif text-xl font-bold text-white">Initiativ</h3>
                                                    <div className="flex gap-2">
                                                        <button onClick={rollInitiative} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm flex items-center gap-2"><RotateCcw size={14} /> Rul NPC'er</button>
                                                        <button onClick={() => { clearCombatants(); playClick(); }} className="px-3 py-1 bg-inferia/20 hover:bg-inferia/40 text-inferia rounded text-sm flex items-center gap-2"><Trash2 size={14} /> Ryd</button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 overflow-y-auto pr-2 max-h-[500px]">
                                                    {combatants.map((c) => (
                                                        <div key={c.id} className={`flex items-center gap-4 p-3 rounded-lg border ${c.type === 'player' ? 'bg-blue-900/20 border-blue-500/30' : 'bg-red-900/10 border-red-500/20'} transition-all`}>
                                                            <div className="font-bold text-2xl w-12 text-center text-white/50">{c.initiative}</div>
                                                            <div className="flex-1">
                                                                <div className="font-serif text-lg font-bold text-white">{c.name}</div>
                                                                <div className="flex gap-4 text-sm text-text-dim">
                                                                    <div className="flex items-center gap-1"><span className={c.hp < c.maxHp / 2 ? "text-inferia font-bold" : "text-green-500"}>{c.hp}</span>/{c.maxHp} HP</div>
                                                                    <div>AC {c.ac}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <div className="flex flex-col gap-1">
                                                                    <button onClick={() => updateCombatant(c.id, { hp: c.hp + 1 })} className="p-1 hover:bg-white/10 rounded text-green-500 text-xs">+</button>
                                                                    <button onClick={() => updateCombatant(c.id, { hp: c.hp - 1 })} className="p-1 hover:bg-white/10 rounded text-inferia text-xs">-</button>
                                                                </div>
                                                                <button onClick={() => removeCombatant(c.id)} className="p-2 text-text-dim hover:text-inferia"><X size={18} /></button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {combatants.length === 0 && <div className="text-center text-text-dim italic py-10">Ingen kombattanter</div>}
                                                </div>
                                            </div>

                                            {/* Add New */}
                                            <div className="bg-black/20 p-4 rounded-xl border border-white/5 h-fit">
                                                <h3 className="font-serif font-bold text-lg mb-4 text-superia">Tilføj</h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-xs text-text-dim uppercase">Navn</label>
                                                        <input
                                                            type="text"
                                                            value={newCombatant.name}
                                                            onChange={e => setNewCombatant({ ...newCombatant, name: e.target.value })}
                                                            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white focus:border-superia outline-none"
                                                            placeholder="Goblin Boss"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-xs text-text-dim uppercase">Init Modifier</label>
                                                            <input
                                                                type="number"
                                                                value={newCombatant.initiative}
                                                                onChange={e => setNewCombatant({ ...newCombatant, initiative: parseInt(e.target.value) || 0 })}
                                                                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-center"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-text-dim uppercase">AC</label>
                                                            <input
                                                                type="number"
                                                                value={newCombatant.ac}
                                                                onChange={e => setNewCombatant({ ...newCombatant, ac: parseInt(e.target.value) || 10 })}
                                                                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-center"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-xs text-text-dim uppercase">HP</label>
                                                            <input
                                                                type="number"
                                                                value={newCombatant.hp}
                                                                onChange={e => setNewCombatant({ ...newCombatant, hp: parseInt(e.target.value) || 10, maxHp: parseInt(e.target.value) || 10 })}
                                                                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-center"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-text-dim uppercase">Type</label>
                                                            <select
                                                                value={newCombatant.type}
                                                                onChange={e => setNewCombatant({ ...newCombatant, type: e.target.value as any })}
                                                                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white"
                                                            >
                                                                <option value="monster">Monster</option>
                                                                <option value="player">Spiller</option>
                                                                <option value="npc">NPC</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={handleAddCombatant}
                                                        className="w-full py-3 mt-2 bg-superia text-black font-bold uppercase tracking-wider rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <Plus size={18} /> Tilføj
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'dice' && (
                                        <div className="text-center py-10">
                                            <div className="text-6xl font-bold font-serif text-superia mb-8 min-h-[80px] flex items-center justify-center">
                                                {rollResult || "Rul terningerne"}
                                            </div>
                                            <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
                                                {[4, 6, 8, 10, 12, 20, 100].map(sides => (
                                                    <button
                                                        key={sides}
                                                        onClick={() => rollDice(sides)}
                                                        className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 hover:border-superia hover:bg-superia/10 flex flex-col items-center justify-center gap-1 transition-all group"
                                                    >
                                                        <Dna size={24} className="text-text-dim group-hover:text-superia transition-colors" />
                                                        <span className="font-bold text-white">d{sides}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'prices' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <h3 className="text-yellow-500 font-bold text-lg mb-4">Kro & Mad</h3>
                                                <table className="w-full border-collapse text-sm">
                                                    <thead>
                                                        <tr className="border-b border-white/10 text-text-dim">
                                                            <th className="text-left p-2">Vare</th>
                                                            <th className="text-right p-2">Pris</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr><td className="p-2">Simpelt måltid</td><td className="text-right p-2">3 cp</td></tr>
                                                        <tr><td className="p-2">Godt måltid en Ale</td><td className="text-right p-2">5 sp</td></tr>
                                                        <tr><td className="p-2">Fint måltid (Vin)</td><td className="text-right p-2">2 gp</td></tr>
                                                        <tr><td className="p-2 text-text-dim">Overnatning (Stald)</td><td className="text-right p-2">5 cp</td></tr>
                                                        <tr><td className="p-2">Overnatning (Fælles)</td><td className="text-right p-2">2 sp</td></tr>
                                                        <tr><td className="p-2">Overnatning (Privat)</td><td className="text-right p-2">1 gp</td></tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div>
                                                <h3 className="text-orange-500 font-bold text-lg mb-4">Standard Udstyr</h3>
                                                <table className="w-full border-collapse text-sm">
                                                    <thead>
                                                        <tr className="border-b border-white/10 text-text-dim">
                                                            <th className="text-left p-2">Vare</th>
                                                            <th className="text-right p-2">Pris</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr><td className="p-2">Fakkel</td><td className="text-right p-2">1 cp</td></tr>
                                                        <tr><td className="p-2">Reb (50ft)</td><td className="text-right p-2">1 gp</td></tr>
                                                        <tr><td className="p-2">Lægeurter (Healer's Kit)</td><td className="text-right p-2">5 gp</td></tr>
                                                        <tr><td className="p-2">Potion of Healing (2d4+2)</td><td className="text-right p-2">50 gp</td></tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'travel' && (
                                        <div>
                                            <h3 className="text-green-500 font-bold text-lg mb-4">Rejsehastigheder</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-white/5 p-4 rounded-lg text-center">
                                                    <h4 className="mb-2 text-white">Til Fods (Normal)</h4>
                                                    <div className="text-2xl font-bold">24 miles</div>
                                                    <div className="text-xs text-text-dim">pr. dag (8 timer)</div>
                                                </div>
                                                <div className="bg-white/5 p-4 rounded-lg text-center">
                                                    <h4 className="mb-2 text-white">Til Hest (Galop)</h4>
                                                    <div className="text-2xl font-bold">48 miles</div>
                                                    <div className="text-xs text-text-dim">pr. dag (kræver friske heste)</div>
                                                </div>
                                                <div className="bg-white/5 p-4 rounded-lg text-center">
                                                    <h4 className="mb-2 text-white">Skib (Sejl)</h4>
                                                    <div className="text-2xl font-bold">2-4 mph</div>
                                                    <div className="text-xs text-text-dim">afhængig af vind</div>
                                                </div>
                                            </div>

                                            <h3 className="text-blue-500 font-bold text-lg mt-8 mb-4">Synsvidde</h3>
                                            <table className="w-full border-collapse text-sm">
                                                <tbody>
                                                    <tr className="bg-white/5"><td className="p-3">Klart vejr, åbent landskab</td><td className="text-right p-3">2 miles (~3 km)</td></tr>
                                                    <tr><td className="p-3">Let regn / Tåge</td><td className="text-right p-3">100-300 ft</td></tr>
                                                    <tr className="bg-white/5"><td className="p-3">Tæt skov</td><td className="text-right p-3">50-100 ft</td></tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {activeTab === 'time' && (
                                        <div className="text-center">
                                            <h3 className="text-purple-500 font-bold text-lg mb-4">Kalender & Måneder</h3>
                                            <p className="text-text-dim mb-8">Et år har 365 dage, fordelt på 12 måneder af 30 dage + 5 helligdage.</p>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {['Janus', 'Februa', 'Martis', 'Aprilis', 'Maia', 'Junio', 'Quintilis', 'Sextilis', 'September', 'October', 'November', 'December'].map((m, i) => (
                                                    <div key={m} className="bg-white/5 p-4 rounded-lg">
                                                        <div className="text-xs opacity-50 mb-1">Måned {i + 1}</div>
                                                        <div className="font-bold">{m}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </MysticCard>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

