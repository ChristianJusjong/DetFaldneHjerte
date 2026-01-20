import { useRef, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, MapPin, Skull, Book, Users, Star, History, Trash2, ArrowRight } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { useNavigate } from 'react-router-dom';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { searchLore, type SearchResult } from '../utils/search';
import { clsx } from 'clsx';
import { MysticCard } from './ui/MysticCard';

export const SearchModal = () => {
    const { isSearchOpen, setSearchOpen, recentSearches, addRecentSearch, clearRecentSearches } = useGameStore();
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const { playClick, playHover } = useSoundEffects();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Focus input when opened
    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            inputRef.current.focus();
            setQuery('');
            setResults([]);
            setSelectedIndex(0);
        }
    }, [isSearchOpen]);

    // Handle Search
    useEffect(() => {
        if (query.trim().length > 1) {
            const hits = searchLore(query);
            setResults(hits.slice(0, 8)); // Limit to top 8
            setSelectedIndex(0);
        } else {
            setResults([]);
        }
    }, [query]);

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
    }, [isSearchOpen, results, selectedIndex, query]);

    const handleSelect = (result: SearchResult) => {
        addRecentSearch(result.title);
        navigate(result.path);
        setSearchOpen(false);
        playClick();
    };

    const handleRecentClick = (term: string) => {
        setQuery(term);
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
                <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh] px-4 bg-black/80 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <MysticCard noPadding className="shadow-2xl border-superia/30 overflow-hidden flex flex-col max-h-[70vh]">
                            {/* Input Field */}
                            <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-white/5">
                                <Search className="text-superia" size={24} />
                                <input
                                    ref={inputRef}
                                    className="flex-1 bg-transparent border-none outline-none text-xl font-serif text-white placeholder:text-text-dim"
                                    placeholder="Søg i visdommen..."
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                />
                                <div className="text-xs text-text-dim border border-white/10 px-2 py-1 rounded bg-black/20 hidden md:block">ESC</div>
                                <X size={24} className="cursor-pointer text-text-dim hover:text-white" onClick={() => setSearchOpen(false)} />
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
                                                        className="flex items-center justify-between px-3 py-2 rounded text-sm text-text-muted hover:bg-white/5 hover:text-white transition-all text-left group"
                                                        onMouseEnter={() => playHover()}
                                                    >
                                                        <span>{term}</span>
                                                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-50 -translate-x-2 group-hover:translate-x-0 transition-all" />
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
                                                        i === selectedIndex ? "bg-superia/10 border-superia" : "border-transparent hover:bg-white/5"
                                                    )}
                                                >
                                                    <div className={clsx("p-2 rounded bg-black/20", i === selectedIndex ? "text-superia" : "text-text-dim")}>
                                                        {getIcon(result.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className={clsx("font-serif font-bold truncate", i === selectedIndex ? "text-white" : "text-text-muted")}>
                                                            {result.title}
                                                        </div>
                                                        <div className="text-xs text-text-dim truncate">
                                                            {result.description}
                                                        </div>
                                                    </div>
                                                    {i === selectedIndex && (
                                                        <ArrowRight size={16} className="text-superia mr-2 animate-pulse" />
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center text-text-dim italic">
                                                Intet fundet i arkiverne...
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-2 border-t border-white/10 bg-black/40 text-[10px] text-center text-text-dim">
                                Brug <kbd className="bg-white/10 px-1 rounded mx-1">↑</kbd> <kbd className="bg-white/10 px-1 rounded mx-1">↓</kbd> til at navigere, <kbd className="bg-white/10 px-1 rounded mx-1">Enter</kbd> for at vælge
                            </div>
                        </MysticCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
