import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown, Home, Globe, Map, Star, BookOpen, UserPlus } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { getLore } from '../utils/data';
import { slugify } from '../utils/helpers';
import type { Continent } from '../types';

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
                const c = plane.continents.find(c => c.id === contId || slugify(c.name) === contId);
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
                    siblings: data.planes.flatMap(p => p.continents).map(c => ({
                        id: c.id,
                        label: c.name,
                        url: `/continent/${c.id}`
                    }))
                });

                // 2. Region
                if (pathSegments[2]) {
                    const regId = pathSegments[2];
                    const foundReg = foundCont.regions.find(r => slugify(r.name) === regId);

                    if (foundReg) {
                        crumbs.push({
                            id: regId,
                            label: foundReg.name,
                            type: 'region',
                            url: `/continent/${foundCont.id}/${regId}`,
                            siblings: foundCont.regions.map(r => ({
                                id: slugify(r.name),
                                label: r.name,
                                url: `/continent/${foundCont.id}/${slugify(r.name)}`
                            }))
                        });

                        // 3. City
                        if (pathSegments[3]) {
                            const cityId = pathSegments[3];
                            const foundCity = foundReg.cities.find(c => slugify(c.name) === cityId);

                            if (foundCity) {
                                crumbs.push({
                                    id: cityId,
                                    label: foundCity.name,
                                    type: 'city',
                                    url: `/continent/${foundCont.id}/${regId}/${cityId}`,
                                    siblings: foundReg.cities.map(c => ({
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
        <nav className="fixed top-0 left-0 right-0 h-16 bg-[#121212] border-b-2 border-[#3d342b] z-50 shadow-2xl" ref={containerRef}>
            {/* Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none" />

            <div className="relative flex items-center h-full px-4 md:px-8 max-w-[1920px] mx-auto z-10">

                {/* Logo / Home */}
                <Link to="/" className="flex items-center gap-2 mr-8 text-superia hover:text-white transition-colors group relative">
                    <div className="absolute -inset-2 bg-superia/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Globe size={24} className="group-hover:rotate-180 transition-transform duration-1000" />
                    <span className="font-serif font-bold text-lg tracking-[0.2em] hidden md:block text-shadow-sm">COR</span>
                </Link>

                {/* Breadcrumbs List */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mask-gradient flex-1">
                    {breadcrumbs.map((crumb, idx) => (
                        <div key={crumb.id} className="flex items-center shrink-0">
                            {idx > 0 && <ChevronRight size={14} className="text-[#5a4d3b] mx-2" />}

                            <div className="relative">
                                <button
                                    onClick={() => setOpenDropdown(openDropdown === crumb.id ? null : crumb.id)}
                                    className={clsx(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-sm font-serif text-sm md:text-base transition-all border border-transparent",
                                        "hover:border-superia/30 hover:bg-white/5 hover:text-white",
                                        openDropdown === crumb.id
                                            ? "bg-[#1e1e1e] border-superia/50 text-superia shadow-[0_0_10px_rgba(212,175,55,0.1)]"
                                            : "text-[#c0b4a0]"
                                    )}
                                >
                                    {/* Icon based on type */}
                                    {crumb.type === 'continent' && <Map size={14} className="opacity-70" />}
                                    {crumb.type === 'city' && <Home size={14} className="opacity-70" />}

                                    <span className="font-medium tracking-wide">{crumb.label}</span>

                                    {crumb.siblings && crumb.siblings.length > 0 && (
                                        <ChevronDown size={12} className={clsx("opacity-50 transition-transform duration-300", openDropdown === crumb.id && "rotate-180 text-superia")} />
                                    )}
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {openDropdown === crumb.id && crumb.siblings && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute top-full left-0 mt-2 w-64 bg-[#1e1e1e] border border-superia/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-sm overflow-hidden z-50 text-left"
                                        >
                                            {/* Decorative Corner */}
                                            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-20 bg-gradient-to-bl from-superia to-transparent" />

                                            <div className="px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-[#8b7e6b] border-b border-[#2d2820] bg-black/20 font-serif">
                                                Vælg {crumb.type}
                                            </div>

                                            <div className="max-h-72 overflow-y-auto custom-scrollbar p-2 space-y-1">
                                                {crumb.siblings.map(sibling => (
                                                    <Link
                                                        key={sibling.id}
                                                        to={sibling.url}
                                                        onClick={() => setOpenDropdown(null)}
                                                        className={clsx(
                                                            "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all group",
                                                            "hover:bg-[#2a2520] border border-transparent hover:border-superia/10",
                                                            sibling.id === crumb.id ? "bg-[#25201b] border-superia/20 text-superia" : "text-[#a8a090]"
                                                        )}
                                                    >
                                                        <span className={clsx(
                                                            "w-1.5 h-1.5 rounded-full transition-colors",
                                                            sibling.id === crumb.id ? "bg-superia shadow-[0_0_8px_rgba(212,175,55,0.8)]" : "bg-[#3d342b] group-hover:bg-superia/50"
                                                        )} />
                                                        <span className={clsx("font-serif", sibling.id === crumb.id && "font-bold tracking-wide")}>
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

                {/* Right Actions: Search etc */}
                <div className="ml-auto pl-6 border-l border-[#3d342b] flex items-center gap-4">
                    {/* Bookmarks */}
                    <div className="relative" ref={bookmarksRef}>
                        <button
                            onClick={() => setIsBookmarksOpen(!isBookmarksOpen)}
                            className={clsx(
                                "p-2 rounded-sm transition-all hover:bg-superia/5 hover:text-superia border border-transparent hover:border-superia/20",
                                isBookmarksOpen ? "text-superia bg-superia/10 border-superia/20" : "text-[#8b8b8b]"
                            )}
                            title="Favoritter"
                        >
                            <Star size={20} className={bookmarks.length > 0 ? "fill-current" : undefined} />
                        </button>

                        <AnimatePresence>
                            {isBookmarksOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute top-full right-0 mt-3 w-72 bg-[#1e1e1e] border border-superia/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-sm overflow-hidden z-50"
                                >
                                    <div className="px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-[#8b7e6b] border-b border-[#2d2820] bg-black/20 font-serif">
                                        Bogmærker
                                    </div>
                                    <div className="max-h-72 overflow-y-auto custom-scrollbar p-2">
                                        {bookmarks.length === 0 ? (
                                            <div className="px-3 py-6 text-sm text-[#5a4d3b] text-center italic font-serif">
                                                Ingen favoritter endnu...
                                            </div>
                                        ) : (
                                            bookmarks.map((b, i) => (
                                                <Link
                                                    key={`${b.url}-${i}`}
                                                    to={b.url}
                                                    onClick={() => setIsBookmarksOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-[#c0b4a0] hover:bg-[#2a2520] hover:text-superia hover:border-superia/20 border border-transparent transition-all group"
                                                >
                                                    <span className="opacity-40 group-hover:opacity-100 transition-opacity text-superia">
                                                        {b.type === 'continent' || b.type === 'region' ? <Map size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-superia" />}
                                                    </span>
                                                    <span className="font-serif">{b.title}</span>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Tools */}
                    <div className="flex bg-black/20 rounded-sm border border-[#2d2820] p-1 gap-1">
                        <button
                            onClick={() => setNPCGeneratorOpen(true)}
                            className="p-2 text-[#8b8b8b] hover:text-superia hover:bg-superia/5 rounded-sm transition-all"
                            title="NPC Generator"
                        >
                            <UserPlus size={18} />
                        </button>
                        <button
                            onClick={() => setDMScreenOpen(true)}
                            className="p-2 text-[#8b8b8b] hover:text-superia hover:bg-superia/5 rounded-sm transition-all"
                            title="DM Skærm"
                        >
                            <BookOpen size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Vignette Overlay for global immersion only on nav bar? No, main vignette is usually global body, 
                but here we add a shadow gradient to blend nav into content */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-superia/30 to-transparent" />
        </nav>
    );
};
