import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown, Home, Globe, Map, Star, BookOpen, UserPlus, Search } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
import { useGameStore } from '@/app/store/useGameStore';
import { getLore } from '@/features/lore/utils/data';
import { slugify } from '@/shared/utils/helpers';
import type { Continent } from '@/shared/types';

interface BreadcrumbItem {
    id: string;
    label: string;
    type: 'world' | 'plane' | 'continent' | 'region' | 'city' | 'district';
    url: string;
    siblings?: { id: string; label: string; url: string }[];
}

export const DrillDownMenu = () => {
    const location = useLocation();
    const data = getLore();
    const { bookmarks, setDMScreenOpen, setNPCGeneratorOpen } = useGameStore();

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const bookmarksRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
            if (bookmarksRef.current && !bookmarksRef.current.contains(event.target as Node)) {
                setIsBookmarksOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Build breadcrumb trail based on current path
    const buildBreadcrumbs = (): BreadcrumbItem[] => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const crumbs: BreadcrumbItem[] = [
            {
                id: 'world',
                label: 'Cor',
                type: 'world',
                url: '/',
                siblings: [
                    { id: 'races', label: 'Racer', url: '/races' },
                    { id: 'orgs', label: 'Organisationer', url: '/organizations' },
                    { id: 'religion', label: 'Religion', url: '/religion' },
                    { id: 'conflict', label: 'Konflikter', url: '/conflict' },
                    { id: 'bestiary', label: 'Bestiarie', url: '/bestiary' },
                ]
            }
        ];

        // 1. Plane Check (Implicit or Explicit)
        // For simplicity, we assume we are navigating the main geography route: /continent/...
        if (pathSegments[0] === 'continent' && pathSegments[1]) {
            const contId = pathSegments[1];
            // Find continent and its plane
            let foundCont: Continent | undefined;

            for (const plane of data.planes) {
                const c = plane.continents?.find(c => c.id === contId || slugify(c.name) === contId);
                if (c) {
                    foundCont = c;
                    break;
                }
            }

            if (foundCont) {
                // Add Continent
                crumbs.push({
                    id: foundCont.id,
                    label: foundCont.name,
                    type: 'continent',
                    url: `/continent/${foundCont.id}`, // Planes are often implicit in this routing structure
                    siblings: data.planes.flatMap(p => p.continents || []).map(c => ({
                        id: c.id,
                        label: c.name,
                        url: `/continent/${c.id}`
                    }))
                });

                // 2. Region
                if (pathSegments[2]) {
                    const regId = pathSegments[2];
                    const foundReg = foundCont.regions?.find(r => slugify(r.name) === regId);

                    if (foundReg) {
                        crumbs.push({
                            id: regId,
                            label: foundReg.name,
                            type: 'region',
                            url: `/continent/${foundCont.id}/${regId}`,
                            siblings: foundCont.regions?.map(r => ({
                                id: slugify(r.name),
                                label: r.name,
                                url: `/continent/${foundCont.id}/${slugify(r.name)}`
                            })) || []
                        });

                        // 3. City
                        if (pathSegments[3]) {
                            const cityId = pathSegments[3];
                            const foundCity = foundReg.cities?.find(c => slugify(c.name) === cityId);

                            if (foundCity) {
                                crumbs.push({
                                    id: cityId,
                                    label: foundCity.name,
                                    type: 'city',
                                    url: `/continent/${foundCont.id}/${regId}/${cityId}`,
                                    siblings: foundReg.cities?.map(c => ({
                                        id: slugify(c.name),
                                        label: c.name,
                                        url: `/continent/${foundCont.id}/${regId}/${slugify(c.name)}`
                                    }))
                                });

                                // 4. District / Asset context would go here if routed
                            }
                        }
                    }
                }
            }
        }
        // Handle direct top-level pages
        else if (pathSegments[0] && pathSegments[0] !== 'continent') {
            const pageId = pathSegments[0];
            const labelMap: Record<string, string> = {
                races: 'Racer',
                organizations: 'Organisationer',
                religion: 'Religion',
                conflict: 'Konflikter',
                bestiary: 'Bestiarie',
                travel: 'Rejsemetoder',
                plane: 'Planer'
            };

            crumbs.push({
                id: pageId,
                label: labelMap[pageId] || pageId.charAt(0).toUpperCase() + pageId.slice(1),
                type: 'world',
                url: `/${pageId}`,
                // Siblings checked against main nav
                siblings: [
                    { id: 'races', label: 'Racer', url: '/races' },
                    { id: 'orgs', label: 'Organisationer', url: '/organizations' },
                    { id: 'conflict', label: 'Konflikter', url: '/conflict' },
                    { id: 'bestiary', label: 'Bestiarie', url: '/bestiary' },
                ]
            });
        }

        return crumbs;
    };

    const breadcrumbs = buildBreadcrumbs();

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-surface/40 backdrop-blur-2xl border-b border-white/10 shadow-glass-gold z-50 transition-all duration-300" ref={containerRef}>
            <div className="relative flex items-center h-full px-4 lg:px-12 max-w-[2000px] mx-auto z-10">

                {/* Logo / Home */}
                <Link to="/" className="flex items-center gap-3 mr-6 text-superia hover:text-white transition-all group relative">
                    <div className="absolute -inset-2 bg-superia/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-1.5 bg-black/40 rounded-lg border border-superia/20 group-hover:border-superia/50 transition-colors">
                        <Globe size={22} className="group-hover:rotate-180 transition-transform duration-1000" />
                    </div>
                    <span className="font-serif font-black text-xl tracking-[0.3em] hidden sm:block text-gold-gradient">COR</span>
                </Link>

                {/* Breadcrumbs List - Improved Responsiveness */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mask-gradient flex-1 py-1">
                    {breadcrumbs.map((crumb, idx) => (
                        <div key={crumb.id} className="flex items-center shrink-0">
                            {idx > 0 && <ChevronRight size={12} className="text-superia/30 mx-1 md:mx-2" />}

                            <div className="relative">
                                <button
                                    onClick={() => setOpenDropdown(openDropdown === crumb.id ? null : crumb.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-lg font-serif text-xs md:text-sm transition-all border border-transparent",
                                        "hover:bg-white/5 hover:text-white uppercase tracking-wider",
                                        openDropdown === crumb.id
                                            ? "bg-superia/10 border-superia/30 text-superia shadow-premium-hover"
                                            : "text-text-dim"
                                    )}
                                >
                                    {/* Icon based on type - Hidden on very small screens */}
                                    <span className="hidden md:block">
                                        {crumb.type === 'continent' && <Map size={14} className="opacity-70" />}
                                        {crumb.type === 'city' && <Home size={14} className="opacity-70" />}
                                    </span>

                                    <span className="font-bold">{crumb.label}</span>

                                    {crumb.siblings && crumb.siblings.length > 0 && (
                                        <ChevronDown size={12} className={cn("opacity-40 transition-transform duration-300", openDropdown === crumb.id && "rotate-180 text-superia")} />
                                    )}
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {openDropdown === crumb.id && crumb.siblings && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute top-full left-0 mt-3 w-64 bg-bg/95 backdrop-blur-2xl border border-white/10 shadow-premium rounded-2xl overflow-hidden z-50 text-left"
                                        >
                                            <div className="px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-superia/60 border-b border-white/5 bg-white/5 font-serif font-bold">
                                                Gå til {crumb.type}
                                            </div>

                                            <div className="max-h-80 overflow-y-auto custom-scrollbar p-2 space-y-1">
                                                {crumb.siblings.map(sibling => (
                                                    <Link
                                                        key={sibling.id}
                                                        to={sibling.url}
                                                        onClick={() => setOpenDropdown(null)}
                                                        className={cn(
                                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group",
                                                            "hover:bg-superia/5 border border-transparent hover:border-superia/20",
                                                            sibling.id === crumb.id ? "bg-superia/10 border-superia/20 text-superia" : "text-text-dim hover:text-text-main"
                                                        )}
                                                    >
                                                        <span className={cn(
                                                            "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                                            sibling.id === crumb.id ? "bg-superia shadow-[0_0_10px_rgba(252,211,77,0.8)]" : "bg-white/10 group-hover:bg-superia/40"
                                                        )} />
                                                        <span className="font-serif tracking-wide uppercase text-xs font-bold">
                                                            {sibling.label}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Actions - Compact & Integrated */}
                <div className="ml-auto flex items-center gap-2 md:gap-4 pl-4 border-l border-white/5">
                    
                    {/* Compact Search Button */}
                    <button
                        onClick={() => useGameStore.getState().setSearchOpen(true)}
                        className="p-2.5 rounded-xl transition-all text-text-dim hover:text-superia hover:bg-superia/10 border border-transparent hover:border-superia/20"
                        title="Søg ( / )"
                    >
                        <Search size={18} />
                    </button>

                    {/* Bookmarks */}
                    <div className="relative" ref={bookmarksRef}>
                        <button
                            onClick={() => setIsBookmarksOpen(!isBookmarksOpen)}
                            className={cn(
                                "p-2.5 rounded-xl transition-all hover:bg-superia/10 hover:text-superia border border-transparent hover:border-superia/20",
                                isBookmarksOpen ? "text-superia bg-superia/10 border-superia/20" : "text-text-dim"
                            )}
                            title="Favoritter"
                        >
                            <Star size={18} className={bookmarks.length > 0 ? "fill-current" : undefined} />
                        </button>

                        <AnimatePresence>
                            {isBookmarksOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute top-full right-0 mt-3 w-72 bg-bg/95 backdrop-blur-2xl border border-white/10 shadow-premium rounded-2xl overflow-hidden z-50"
                                >
                                    <div className="px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-superia/60 border-b border-white/5 bg-white/5 font-serif font-bold">
                                        Favorit Bogmærker
                                    </div>
                                    <div className="max-h-72 overflow-y-auto custom-scrollbar p-2">
                                        {bookmarks.length === 0 ? (
                                            <div className="px-4 py-8 text-xs text-text-dim text-center italic font-serif tracking-widest uppercase opacity-60">
                                                Intet gemt endnu
                                            </div>
                                        ) : (
                                            bookmarks.map((b, i) => (
                                                <Link
                                                    key={`${b.url}-${i}`}
                                                    to={b.url}
                                                    onClick={() => setIsBookmarksOpen(false)}
                                                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-xs text-text-dim hover:bg-superia/5 hover:text-superia border border-transparent transition-all group uppercase font-bold tracking-wider"
                                                >
                                                    <span className="opacity-40 group-hover:opacity-100 transition-opacity text-superia">
                                                        {b.type === 'continent' || b.type === 'region' ? <Map size={14} /> : <div className="w-1 h-1 rounded-full bg-superia" />}
                                                    </span>
                                                    <span>{b.title}</span>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Integrated Tools - Modern Pill UI */}
                    <div className="flex bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-1 gap-0.5 shadow-inner">
                        <button
                            onClick={() => setNPCGeneratorOpen(true)}
                            className="p-2 text-text-dim hover:text-superia hover:bg-white/5 rounded-xl transition-all"
                            title="NPC Generator"
                        >
                            <UserPlus size={18} />
                        </button>
                        <button
                            onClick={() => setDMScreenOpen(true)}
                            className="p-2 text-text-dim hover:text-superia hover:bg-white/5 rounded-xl transition-all"
                            title="DM Screen"
                        >
                            <BookOpen size={18} />
                        </button>
                        <Link
                            to="/web"
                            className="p-2 text-text-dim hover:text-superia hover:bg-white/5 rounded-xl transition-all"
                            title="Lore Graph"
                        >
                            <Globe size={18} />
                        </Link>
                        <Link
                            to="/map"
                            className="hidden sm:flex p-2 text-text-dim hover:text-superia hover:bg-white/5 rounded-xl transition-all"
                            title="World Map"
                        >
                            <Map size={18} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Glow Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-superia/40 to-transparent shadow-[0_0_15px_rgba(252,211,77,0.3)]" />
        </nav>
    );
};
