import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, MapPin, Skull, Book, Users, Star, History, Trash2, ArrowRight } from 'lucide-react';
import { useGameStore } from '@/app/store/useGameStore';
import { useNavigate } from 'react-router-dom';
import { useSoundEffects } from '@/features/audio/hooks/useSoundEffects';
import { searchLore, type SearchResult } from '@/features/search/logic/search';
import { clsx } from 'clsx';
import { MysticCard } from '@/shared/components/MysticCard';

export const SearchModal = () => {
    const { isSearchOpen, setSearchOpen, recentSearches, addRecentSearch, clearRecentSearches } = useGameStore();
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const { playClick, playHover } = useSoundEffects();
    const [query, setQuery] = useState('');
    // results is derived now
    // results is derived now
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [activeFilter, setActiveFilter] = useState<string>('all');

    const filters = [
        { id: 'all', label: 'Alt' },
        { id: 'city', label: 'Byer', icon: <MapPin size={12} /> },
        { id: 'god', label: 'Guder', icon: <Star size={12} /> },
        { id: 'organization', label: 'Org', icon: <Book size={12} /> },
        { id: 'bestiary', label: 'Monstre', icon: <Skull size={12} /> }
    ];

    // Focus input when opened
    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearchOpen]);

    // Derived Results
    const results = useMemo(() => query.trim().length > 1 ? searchLore(query, activeFilter).slice(0, 8) : [], [query, activeFilter]);

    const handleSelect = useCallback((result: SearchResult) => {
        addRecentSearch(result.title);
        navigate(result.path);
        setSearchOpen(false);
        playClick();
    }, [addRecentSearch, navigate, setSearchOpen, playClick]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isSearchOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % (results.length > 0 ? results.length : 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + (results.length > 0 ? results.length : 1)) % (results.length > 0 ? results.length : 1));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (results.length > 0) {
                    handleSelect(results[selectedIndex]);
                } else if (query.trim()) {
                    // Fallback or do nothing
                }
            } else if (e.key === 'Escape') {
                setSearchOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSearchOpen, handleSelect, results, selectedIndex, query, setSearchOpen, navigate, addRecentSearch, playClick]);

    // Note: handleSelect is stable or recreated? If we include it in deps, we need useCallback.
    // Simplifying: we can leave handleSelect OUT of the effect usage if we inline the logic or use a ref, 
    // OR we just add it to deps and hope linter is happy.
    // Actually, linter complained handleSelect was missing. I will verify handleSelect stability.
    // It depends on playClick, navigate, addRecentSearch.

    // Better path:
    // Move handleSelect definition inside the effect? No, it's used in render.
    // I will just add handlers updates.

    const handleRecentClick = (term: string) => {
        setQuery(term);
        setSelectedIndex(0);
        inputRef.current?.focus();
        playClick();
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'city': return <MapPin size={16} className="text-superia" />;
            case 'region': return <MapPin size={16} className="text-superia/70" />;
            case 'continent': return <MapPin size={16} className="text-superia/50" />;
            case 'god': return <Star size={16} className="text-yellow-500" />;
            case 'race': return <Users size={16} className="text-blue-400" />;
            case 'organization': return <Book size={16} className="text-purple-400" />;
            case 'bestiary': return <Skull size={16} className="text-red-400" />;
            default: return <Search size={16} className="text-text-dim" />;
        }
    };

    return (
        <AnimatePresence>
            {isSearchOpen && (
                <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh] px-4 bg-bg/90 backdrop-blur-lg" onClick={() => setSearchOpen(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <MysticCard noPadding className="shadow-glass border-border overflow-hidden flex flex-col max-h-[70vh] !bg-surface/90 backdrop-blur-xl rounded-2xl">
                            {/* Input Field */}
                            <div className="flex items-center gap-4 p-4 border-b border-border/50 bg-black/30">
                                <Search className="text-superia" size={24} />
                                <input
                                    ref={inputRef}
                                    className="flex-1 bg-transparent border-none outline-none text-xl font-main font-medium text-white placeholder:text-text-dim"
                                    placeholder="Søg i visdommen..."
                                    value={query}
                                    onChange={e => {
                                        setQuery(e.target.value);
                                        setSelectedIndex(0);
                                    }}
                                />
                                <div className="text-[10px] font-main font-semibold text-text-dim border border-border/50 px-2 py-1 rounded-md bg-white/5 hidden md:block uppercase tracking-wider">ESC</div>
                                <X size={24} data-testid="close-search" className="cursor-pointer text-text-dim hover:text-white transition-colors" onClick={() => setSearchOpen(false)} />
                            </div>

                            {/* Filters */}
                            <div className="flex gap-2 p-4 pt-2 border-b border-border/30 overflow-x-auto no-scrollbar">
                                {filters.map(f => (
                                    <button
                                        key={f.id}
                                        onClick={() => { setActiveFilter(f.id); inputRef.current?.focus(); }}
                                        className={clsx(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-main font-medium transition-all border",
                                            activeFilter === f.id
                                                ? "bg-superia/10 border-superia/50 text-superia shadow-[0_0_10px_rgba(252,211,77,0.1)]"
                                                : "bg-white/5 border-transparent text-text-dim hover:bg-white/10 hover:text-white"
                                        )}
                                    >
                                        {f.icon} {f.label}
                                    </button>
                                ))}
                            </div>

                            {/* Results / History */}
                            <div className="overflow-y-auto custom-scrollbar">
                                {query.trim() === '' ? (
                                    recentSearches.length > 0 && (
                                        <div className="p-4">
                                            <div className="flex justify-between items-center mb-2 px-2">
                                                <h4 className="text-xs uppercase tracking-wider text-text-dim font-bold flex items-center gap-2">
                                                    <History size={12} /> Seneste
                                                </h4>
                                                <button onClick={clearRecentSearches} className="text-xs text-inferia hover:underline flex items-center gap-1">
                                                    <Trash2 size={10} /> Ryd
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {recentSearches.map((term, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleRecentClick(term)}
                                                        className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-text-muted hover:bg-white/5 hover:text-white border border-transparent hover:border-border transition-all text-left group"
                                                        onMouseEnter={() => playHover()}
                                                    >
                                                        <span className="font-main">{term}</span>
                                                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-50 -translate-x-2 group-hover:translate-x-0 transition-all text-superia" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div className="py-2">
                                        {results.length > 0 ? (
                                            results.map((result, i) => (
                                                <div
                                                    key={result.id}
                                                    onClick={() => handleSelect(result)}
                                                    onMouseEnter={() => { setSelectedIndex(i); playHover(); }}
                                                    className={clsx(
                                                        "px-4 py-3 cursor-pointer flex items-center gap-4 transition-all border-l-2",
                                                        i === selectedIndex ? "bg-superia/10 border-superia shadow-[inset_2px_0_10px_rgba(252,211,77,0.05)]" : "border-transparent hover:bg-white/5"
                                                    )}
                                                >
                                                    <div className={clsx("p-2 rounded-lg bg-black/20 border border-white/5", i === selectedIndex ? "text-superia border-superia/20" : "text-text-dim")}>
                                                        {getIcon(result.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className={clsx("font-serif font-bold truncate text-lg tracking-wide", i === selectedIndex ? "text-white" : "text-text-main")}>
                                                            {result.title}
                                                        </div>
                                                        <div className="text-xs text-text-dim truncate font-main mt-0.5">
                                                            {result.description}
                                                        </div>
                                                    </div>
                                                    {i === selectedIndex && (
                                                        <ArrowRight size={18} className="text-superia mr-2 animate-pulse" />
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center text-text-dim italic font-main">
                                                Intet fundet i arkiverne...
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-3 border-t border-border/50 bg-black/20 text-[10px] text-center text-text-dim font-main font-semibold uppercase tracking-wider">
                                Brug <kbd className="border border-border/50 bg-white/5 px-1.5 py-0.5 rounded-md mx-1 shadow-sm">↑</kbd> <kbd className="border border-border/50 bg-white/5 px-1.5 py-0.5 rounded-md mx-1 shadow-sm">↓</kbd> til at navigere, <kbd className="border border-border/50 bg-white/5 px-1.5 py-0.5 rounded-md mx-1 shadow-sm">Enter</kbd> for at vælge
                            </div>
                        </MysticCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
