import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, RefreshCw, X, Save, Trash2, Scroll } from 'lucide-react';
import { getLore } from '../utils/data';
import { MysticCard } from './ui/MysticCard';
import { RACE_NAMES, ROLES, QUIRKS } from '../data/names';
import { useGameStore } from '../store/useGameStore';
import { useSoundEffects } from '../hooks/useSoundEffects';
import type { GeneratedNPC } from '../types';

export const NPCGenerator = () => {
    const { isNPCGeneratorOpen, setNPCGeneratorOpen, savedNPCs, saveNPC, deleteNPC } = useGameStore();
    const { playClick, playSuccess, playHover } = useSoundEffects();
    const [activeTab, setActiveTab] = useState<'generate' | 'saved'>('generate');

    // Generator State
    const [generatedNPC, setGeneratedNPC] = useState<GeneratedNPC | null>(null);

    const data = getLore();

    const generateStats = (role: string) => {
        // Base stats
        const stats = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
        const bonus = 4; // Add this many points to key stats based on role

        switch (role) {
            case "Vagt": case "Lejesoldat": case "Soldat":
                stats.str += bonus; stats.con += bonus; break;
            case "Tyv": case "Jæger": case "Spion":
                stats.dex += bonus; stats.wis += bonus; break;
            case "Præst": case "Druide":
                stats.wis += bonus; stats.cha += bonus; break;
            case "Scholar": case "Alkymist": case "Politiker":
                stats.int += bonus; stats.wis += bonus; break;
            case "Købmand": case "Adelig": case "Kroejer": case "Barde":
                stats.cha += bonus; stats.int += bonus; break;
            default: // Random for others
                stats.con += 2; stats.cha += 2;
        }

        // Add some random variation (-1 to +2)
        Object.keys(stats).forEach(k => {
            (stats as any)[k] += Math.floor(Math.random() * 4) - 1;
        });

        return stats;
    };

    const generate = () => {
        const allContinents = data.planes.flatMap(p => p.continents);
        const continent = allContinents[Math.floor(Math.random() * allContinents.length)];
        const race = continent.races[Math.floor(Math.random() * continent.races.length)];

        // Get name list or fallback to Human
        const raceNameList = (RACE_NAMES as any)[race.name] || RACE_NAMES['Menneske'];
        const firstName = raceNameList.first[Math.floor(Math.random() * raceNameList.first.length)];
        const lastName = raceNameList.last[Math.floor(Math.random() * raceNameList.last.length)];
        const role = ROLES[Math.floor(Math.random() * ROLES.length)];

        const newNPC: GeneratedNPC = {
            id: crypto.randomUUID(),
            name: `${firstName} ${lastName}`,
            race: race.name,
            role,
            quirk: QUIRKS[Math.floor(Math.random() * QUIRKS.length)],
            continent: continent.name,
            stats: generateStats(role),
            createdAt: Date.now()
        };

        setGeneratedNPC(newNPC);
        playClick();
    };

    const handleSave = () => {
        if (generatedNPC) {
            saveNPC(generatedNPC);
            playSuccess();
        }
    };

    return (
        <>
            {/* Sidebar Trigger */}
            <div
                onClick={() => { setNPCGeneratorOpen(true); if (!generatedNPC) generate(); playClick(); }}
                className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-white hover:bg-white/5 transition-all cursor-pointer mt-auto border-t border-white/10 group"
                onMouseEnter={() => playHover()}
            >
                <UserPlus size={18} className="text-superia/60 group-hover:text-superia transition-colors" />
                <span className="font-serif text-sm">NPC Generator</span>
            </div>

            <AnimatePresence>
                {isNPCGeneratorOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setNPCGeneratorOpen(false)}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-2xl h-[600px] flex flex-col"
                        >
                            <MysticCard noPadding className="h-full flex flex-col overflow-hidden shadow-2xl border-superia/20">
                                {/* Header */}
                                <div className="p-4 border-b border-border bg-black/40 flex justify-between items-center">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => { setActiveTab('generate'); playClick(); }}
                                            className={`px-4 py-2 rounded-lg font-serif transition-colors ${activeTab === 'generate' ? 'bg-superia/20 text-superia' : 'text-text-dim hover:text-white'}`}
                                        >Generer</button>
                                        <button
                                            onClick={() => { setActiveTab('saved'); playClick(); }}
                                            className={`px-4 py-2 rounded-lg font-serif transition-colors ${activeTab === 'saved' ? 'bg-superia/20 text-superia' : 'text-text-dim hover:text-white'}`}
                                        >Gemte ({savedNPCs.length})</button>
                                    </div>
                                    <X size={24} className="cursor-pointer text-text-dim hover:text-white hover:scale-110 transition-all" onClick={() => setNPCGeneratorOpen(false)} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-6 bg-[url('/assets/noise.svg')] bg-opacity-5">
                                    {activeTab === 'generate' ? (
                                        <div className="h-full flex flex-col">
                                            {generatedNPC ? (
                                                <div className="flex-1 space-y-6">
                                                    <div className="text-center space-y-2">
                                                        <h2 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-superia to-superia/60">
                                                            {generatedNPC.name}
                                                        </h2>
                                                        <div className="flex items-center justify-center gap-3 text-sm tracking-widest uppercase">
                                                            <span className="text-inferia font-bold">{generatedNPC.race}</span>
                                                            <span className="text-border">•</span>
                                                            <span className="text-text-dim">{generatedNPC.role}</span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-6 gap-2 bg-black/20 p-4 rounded-lg border border-white/5">
                                                        {Object.entries(generatedNPC.stats).map(([stat, val]) => (
                                                            <div key={stat} className="text-center">
                                                                <div className="text-[10px] uppercase text-text-search mb-1">{stat}</div>
                                                                <div className="text-xl font-bold font-serif text-superia">{val}</div>
                                                                <div className="text-[10px] text-text-dim">{Math.floor((val - 10) / 2) > 0 ? '+' : ''}{Math.floor((val - 10) / 2)}</div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="bg-black/20 p-6 rounded-xl border border-white/5 space-y-4">
                                                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                            <span className="text-text-dim">Hjemstavn</span>
                                                            <span className="font-serif text-white">{generatedNPC.continent}</span>
                                                        </div>
                                                        <div className="flex justify-between items-start gap-8">
                                                            <span className="text-text-dim shrink-0">Kendetegn</span>
                                                            <span className="font-serif italic text-right text-superia/80">"{generatedNPC.quirk}"</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex-1 flex items-center justify-center text-text-dim italic">
                                                    Klik på Generer for at skabe en ny NPC
                                                </div>
                                            )}

                                            <div className="mt-6 flex gap-3">
                                                <button
                                                    onClick={generate}
                                                    className="flex-1 py-3 px-4 rounded-lg bg-superia text-black font-bold font-serif uppercase tracking-wider hover:bg-white hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all flex items-center justify-center gap-2"
                                                >
                                                    <RefreshCw size={18} /> Generer Ny
                                                </button>
                                                {generatedNPC && (
                                                    <button
                                                        onClick={handleSave}
                                                        disabled={savedNPCs.some(n => n.id === generatedNPC.id)}
                                                        className="px-6 rounded-lg border border-superia/30 text-superia hover:bg-superia/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Save size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {savedNPCs.length === 0 ? (
                                                <div className="text-center text-text-dim py-10 italic">Ingen gemte NPC'er endnu.</div>
                                            ) : (
                                                savedNPCs.map(npc => (
                                                    <div key={npc.id} className="bg-black/20 hover:bg-black/40 p-4 rounded-lg border border-white/5 transition-colors flex justify-between items-center group">
                                                        <div>
                                                            <div className="font-serif font-bold text-white text-lg">{npc.name}</div>
                                                            <div className="text-xs text-text-dim flex gap-2">
                                                                <span className="text-superia">{npc.race}</span>
                                                                <span>•</span>
                                                                <span>{npc.role}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => { setGeneratedNPC(npc); setActiveTab('generate'); playClick(); }}
                                                                className="p-2 hover:text-superia transition-colors"
                                                                title="Vis"
                                                            >
                                                                <Scroll size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => { deleteNPC(npc.id); playClick(); }}
                                                                className="p-2 hover:text-inferia transition-colors"
                                                                title="Slet"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
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

