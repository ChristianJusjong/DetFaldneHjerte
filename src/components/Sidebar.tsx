import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, Sun, Wind, FlaskConical, Sparkles, Menu, X, Map as MapIcon, Users, Globe, Wrench, Star } from 'lucide-react';
import loreData from '../data/lore.json';
import type { LoreData } from '../types';
import { getIconForContinent } from '../utils/helpers';
import { NPCGenerator } from './NPCGenerator';
import { DMScreen } from './DMScreen';
import { SidebarGroup } from './SidebarGroup';
import { useGameStore } from '../store/useGameStore';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { clsx } from 'clsx';

export const Sidebar = () => {
    const data = loreData as unknown as LoreData;
    const [isOpen, setIsOpen] = React.useState(false);
    const { bookmarks } = useGameStore();
    const { playHover, playClick } = useSoundEffects();
    const location = useLocation();

    const handleNavClick = () => {
        if (window.innerWidth <= 1024) {
            setIsOpen(false);
        }
    };

    // Close sidebar when route changes on mobile
    React.useEffect(() => {
        handleNavClick();
    }, [location]);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="fixed top-4 left-4 z-50 p-3 bg-surface border border-border rounded-lg text-superia cursor-pointer lg:hidden shadow-lg hover:bg-surface/80 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Backdrop Overlay - Mobile only */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-30 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={clsx(
                    "fixed top-0 left-0 bottom-0 w-[280px] z-40 overflow-y-auto transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl",
                    "bg-surface border-r-2 border-border", // Base structure
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
                style={{
                    boxShadow: '4px 0 15px rgba(0,0,0,0.5)',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
                }}
            >
                <div className="p-8 text-center border-b-2 border-border relative">
                    <div className="absolute inset-x-0 bottom-[-2px] h-[2px] bg-gradient-to-r from-transparent via-superia/50 to-transparent" />
                    <div className="font-serif text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-superia to-superia/60 tracking-wider drop-shadow-sm">
                        COR
                    </div>
                    <div className="text-xs font-serif text-text-dim uppercase tracking-[0.2em] mt-1">Det Faldne Hjerte</div>
                </div>

                <div className="py-6 px-3 space-y-6">
                    {/* 0. FAVORITTER */}
                    {bookmarks.length > 0 && (
                        <SidebarGroup title="Favoritter" icon={<Star size={16} className="text-superia" />} defaultOpen={true}>
                            {bookmarks.map((b, i) => (
                                <Link
                                    key={`${b.url}-${i}`}
                                    to={b.url}
                                    className="flex items-center gap-3 px-3 py-2 text-text-muted hover:text-superia transition-colors no-underline group"
                                    onClick={() => { handleNavClick(); playClick(); }}
                                    onMouseEnter={() => playHover()}
                                >
                                    <span className="opacity-50 group-hover:opacity-100 transition-opacity">
                                        {b.type === 'continent' && <MapIcon size={16} />}
                                        {b.type === 'region' && <MapIcon size={16} />}
                                        {b.type === 'city' && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                    </span>
                                    <span className="font-serif text-sm">{b.title}</span>
                                </Link>
                            ))}
                        </SidebarGroup>
                    )}

                    {/* 1. LORE */}
                    <SidebarGroup title="Visdom" icon={<Book size={16} className="text-text-dim" />} defaultOpen={true}>
                        {[
                            { to: "/", icon: <Globe size={18} />, label: "Verdenshistorie" },
                            { to: "/religion", icon: <Sun size={18} />, label: "Pulsens Treenighed" },
                            { to: "/conflict", icon: <Sparkles size={18} className="text-inferia" />, label: "Protokol Apatia" },
                            { to: "/travel", icon: <Wind size={18} />, label: "Rejsemetoder" }
                        ].map(item => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="flex items-center gap-3 px-3 py-2 text-text-muted hover:text-white transition-colors no-underline group"
                                onClick={() => { handleNavClick(); playClick(); }}
                                onMouseEnter={() => playHover()}
                            >
                                <span className="opacity-60 group-hover:opacity-100 transition-opacity text-superia">{item.icon}</span>
                                <span className="font-serif text-base">{item.label}</span>
                            </Link>
                        ))}
                    </SidebarGroup>

                    {/* 2. GEOGRAFI */}
                    <SidebarGroup title="Geografi" icon={<MapIcon size={16} className="text-text-dim" />} defaultOpen={false}>
                        {data.planes.map(plane => (
                            <div key={plane.id} className="mb-4 last:mb-0 pl-2 border-l border-white/5">
                                <Link to={`/plane/${plane.id}`} className="block px-2 py-1 text-[10px] font-bold text-text-dim uppercase tracking-[0.2em] mb-1 opacity-70 hover:opacity-100 hover:text-white transition-opacity no-underline" onClick={handleNavClick}>
                                    {plane.name}
                                </Link>
                                {plane.continents.map(cont => (
                                    <Link
                                        key={cont.id}
                                        to={`/continent/${cont.id}`}
                                        className={clsx(
                                            "flex items-center gap-2 px-2 py-1.5 transition-colors no-underline group",
                                            plane.id === 'inferia' ? "text-inferia/70 hover:text-inferia" : "text-text-muted hover:text-white"
                                        )}
                                        onClick={handleNavClick}
                                    >
                                        <span className="opacity-70 group-hover:scale-110 transition-transform duration-300">
                                            {getIconForContinent(cont.id)}
                                        </span>
                                        <span className="font-serif text-sm">{cont.name}</span>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </SidebarGroup>

                    {/* 3. BEBOERE */}
                    <SidebarGroup title="Beboere" icon={<Users size={16} className="text-text-dim" />}>
                        <Link to="/races" className="flex items-center gap-3 px-3 py-2 text-text-muted hover:text-white transition-colors no-underline group" onClick={() => { handleNavClick(); playClick(); }} onMouseEnter={() => playHover()}>
                            <Users size={18} className="text-superia/60 group-hover:text-superia transition-colors" />
                            <span className="font-serif text-base">Racer</span>
                        </Link>
                        <Link to="/organizations" className="flex items-center gap-3 px-3 py-2 text-text-muted hover:text-white transition-colors no-underline group" onClick={() => { handleNavClick(); playClick(); }} onMouseEnter={() => playHover()}>
                            <Book size={18} className="text-superia/60 group-hover:text-superia transition-colors" />
                            <span className="font-serif text-base">Organisationer</span>
                        </Link>
                        <Link to="/bestiary" className="flex items-center gap-3 px-3 py-2 text-text-muted hover:text-white transition-colors no-underline group" onClick={() => { handleNavClick(); playClick(); }} onMouseEnter={() => playHover()}>
                            <FlaskConical size={18} className="text-superia/60 group-hover:text-superia transition-colors" />
                            <span className="font-serif text-base">Bestiarie</span>
                        </Link>
                    </SidebarGroup>

                    {/* 4. VÆRKTØJER */}
                    <SidebarGroup title="DM Værktøjer" icon={<Wrench size={16} className="text-text-dim" />} defaultOpen={true}>
                        <div className="flex flex-col gap-2 pt-1">
                            <DMScreen />
                            <NPCGenerator />
                        </div>
                    </SidebarGroup>
                </div>
            </aside>
        </>
    );

};
