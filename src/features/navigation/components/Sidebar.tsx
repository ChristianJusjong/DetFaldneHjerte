import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    ChevronDown, 
    Home, 
    Globe, 
    Map, 
    Star, 
    BookOpen, 
    UserPlus, 
    Search,
    PanelLeftClose,
    PanelLeftOpen,
    Menu,
    X,
    Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/app/store/useGameStore';
import { getLore } from '@/features/lore/utils/data';
import clsx from 'clsx';

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    url: string;
    type?: string;
    siblings?: { id: string; label: string; url: string }[];
}

export const Sidebar = () => {
    const location = useLocation();
    const data = getLore();
    const { 
        bookmarks, 
        setDMScreenOpen, 
        setNPCGeneratorOpen, 
        setSearchOpen,
        isSidebarCollapsed,
        setSidebarCollapsed,
        isMobileMenuOpen,
        setMobileMenuOpen
    } = useGameStore();

    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const bookmarksRef = useRef<HTMLDivElement>(null);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setIsBookmarksOpen(false);
    }, [location.pathname, setMobileMenuOpen]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (bookmarksRef.current && !bookmarksRef.current.contains(event.target as Node)) {
                setIsBookmarksOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Navigation Items
    const navItems: NavItem[] = [
        { id: 'home', label: 'Hjem', icon: <Home size={20} />, url: '/' },
        { id: 'map', label: 'Verdenskort', icon: <Map size={20} />, url: '/map' },
        { id: 'lore', label: 'Vidensnet', icon: <Globe size={20} />, url: '/web' },
        { 
            id: 'geo', 
            label: 'Geografi', 
            icon: <Compass size={20} />, 
            url: '#',
            siblings: data.planes.flatMap(p => p.continents || []).map(c => ({
                id: c.id,
                label: c.name,
                url: `/continent/${c.id}`
            }))
        },
        { id: 'races', label: 'Racer', icon: <UserPlus size={20} />, url: '/races' },
        { id: 'orgs', label: 'Organisationer', icon: <BookOpen size={20} />, url: '/organizations' },
        { id: 'religion', label: 'Religion', icon: <Star size={20} />, url: '/religion' },
    ];

    const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

    // Desktop Sidebar
    const renderDesktopSidebar = () => (
        <motion.aside
            initial={false}
            animate={{ width: isSidebarCollapsed ? '80px' : '280px' }}
            className={clsx(
                "fixed top-0 left-0 bottom-0 z-50 bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col transition-all duration-500 hidden lg:flex shadow-2xl",
                isSidebarCollapsed ? "items-center" : "items-start"
            )}
            ref={sidebarRef}
        >
            {/* Header / Logo */}
            <div className={clsx("w-full p-6 flex items-center justify-between mb-8", isSidebarCollapsed && "justify-center px-0")}>
                {!isSidebarCollapsed && (
                    <Link to="/" className="flex items-center gap-3 text-superia no-underline group">
                        <div className="p-1.5 bg-superia/10 rounded-lg border border-superia/20 group-hover:border-superia/50 transition-all">
                            <Globe size={22} className="group-hover:rotate-12 transition-transform" />
                        </div>
                        <span className="font-serif font-black text-2xl tracking-[0.2em] text-gold-gradient">COR</span>
                    </Link>
                )}
                {isSidebarCollapsed && <Globe size={24} className="text-superia" />}
            </div>

            {/* Nav Items */}
            <nav className="flex-1 w-full px-3 space-y-2 overflow-y-auto no-scrollbar">
                {navItems.map((item) => (
                    <div key={item.id} className="relative group">
                        <Link
                            to={item.url}
                            onClick={(e) => {
                                if (item.siblings) {
                                    e.preventDefault();
                                    setOpenSubmenu(openSubmenu === item.id ? null : item.id);
                                }
                            }}
                            className={clsx(
                                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 border border-transparent",
                                location.pathname === item.url || (item.siblings && location.pathname.startsWith(item.url))
                                    ? "bg-superia/10 border-superia/20 text-superia shadow-glass-gold"
                                    : "text-text-dim hover:bg-white/5 hover:text-white",
                                isSidebarCollapsed && "justify-center px-0"
                            )}
                        >
                            <span className="shrink-0">{item.icon}</span>
                            {!isSidebarCollapsed && (
                                <>
                                    <span className="font-serif font-bold tracking-wider uppercase text-xs flex-1">{item.label}</span>
                                    {item.siblings && (
                                        <ChevronDown 
                                            size={14} 
                                            className={clsx("transition-transform", openSubmenu === item.id && "rotate-180")} 
                                        />
                                    )}
                                </>
                            )}
                        </Link>

                        {/* Submenu (Desktop) */}
                        {!isSidebarCollapsed && item.siblings && openSubmenu === item.id && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="ml-8 mt-2 space-y-1 border-l border-white/10 pl-4 mb-4"
                            >
                                {item.siblings.map(sibling => (
                                    <Link
                                        key={sibling.id}
                                        to={sibling.url}
                                        className="block py-2 text-[11px] uppercase tracking-widest text-text-dim hover:text-superia transition-colors font-bold"
                                    >
                                        {sibling.label}
                                    </Link>
                                ))}
                            </motion.div>
                        )}

                        {/* Tooltip for collapsed state */}
                        {isSidebarCollapsed && (
                            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/90 border border-white/10 rounded text-[10px] uppercase tracking-widest text-superia opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-[100] whitespace-nowrap">
                                {item.label}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Footer / Controls */}
            <div className="p-4 w-full space-y-4 border-t border-white/5 bg-black/20">
                {/* Bookmarks */}
                <div className="relative" ref={bookmarksRef}>
                    <button
                        onClick={() => setIsBookmarksOpen(!isBookmarksOpen)}
                        className={clsx(
                            "flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all border border-transparent",
                            isBookmarksOpen ? "text-superia bg-superia/10 border-superia/20" : "text-text-dim hover:bg-white/5 hover:text-white",
                            isSidebarCollapsed && "justify-center px-0"
                        )}
                        title="Favoritter"
                    >
                        <Star size={20} className={bookmarks.length > 0 ? "fill-current" : undefined} />
                        {!isSidebarCollapsed && <span className="text-xs font-bold uppercase tracking-widest">Favoritter</span>}
                    </button>

                    <AnimatePresence>
                        {isBookmarksOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="absolute left-full bottom-0 ml-4 w-64 bg-bg/95 backdrop-blur-3xl border border-white/10 shadow-premium rounded-2xl overflow-hidden z-[100]"
                            >
                                <div className="px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-superia/60 border-b border-white/5 bg-white/5 font-serif font-bold">
                                    Favoritter
                                </div>
                                <div className="max-h-64 overflow-y-auto custom-scrollbar p-2">
                                    {bookmarks.length === 0 ? (
                                        <div className="px-4 py-6 text-[10px] text-text-dim text-center italic uppercase tracking-widest opacity-60">
                                            Intet gemt endnu
                                        </div>
                                    ) : (
                                        bookmarks.map((b, i) => (
                                            <Link
                                                key={`${b.url}-${i}`}
                                                to={b.url}
                                                onClick={() => setIsBookmarksOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] text-text-dim hover:bg-superia/5 hover:text-superia border border-transparent transition-all group uppercase font-bold tracking-wider"
                                            >
                                                <span className="opacity-40 group-hover:opacity-100 transition-opacity text-superia shrink-0">
                                                    {b.type === 'continent' || b.type === 'region' ? <Map size={12} /> : <div className="w-1 h-1 rounded-full bg-superia" />}
                                                </span>
                                                <span className="truncate">{b.title}</span>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    onClick={() => setSearchOpen(true)}
                    className={clsx(
                        "flex items-center gap-4 w-full px-4 py-3 rounded-xl text-text-dim hover:bg-superia/10 hover:text-superia transition-all border border-transparent hover:border-superia/20",
                        isSidebarCollapsed && "justify-center px-0"
                    )}
                >
                    <Search size={20} />
                    {!isSidebarCollapsed && <span className="text-xs font-bold uppercase tracking-widest">Søg</span>}
                </button>

                <button
                    onClick={toggleSidebar}
                    className={clsx(
                        "flex items-center gap-4 w-full px-4 py-3 rounded-xl text-text-dim hover:bg-white/5 hover:text-white transition-all border border-transparent",
                        isSidebarCollapsed && "justify-center px-0"
                    )}
                >
                    {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                    {!isSidebarCollapsed && <span className="text-xs font-bold uppercase tracking-widest">Skjul Side</span>}
                </button>
            </div>
        </motion.aside>
    );

    // Mobile Header + Menu
    const renderMobileNav = () => (
        <>
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/60 backdrop-blur-xl border-b border-white/10 z-[60] flex items-center justify-between px-6 shadow-2xl">
                <Link to="/" className="flex items-center gap-2 text-superia no-underline">
                    <Globe size={20} />
                    <span className="font-serif font-black tracking-widest uppercase text-lg">COR</span>
                </Link>

                <div className="flex items-center gap-4">
                    <button onClick={() => setSearchOpen(true)} className="text-text-dim"><Search size={20} /></button>
                    <button 
                        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 bg-superia/10 rounded-lg text-superia border border-superia/20"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '-100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '-100%' }}
                        className="lg:hidden fixed inset-0 z-[55] bg-bg/98 backdrop-blur-3xl pt-24 px-8 pb-10 flex flex-col overflow-y-auto"
                    >
                        <nav className="flex flex-col gap-6">
                            {navItems.map((item) => (
                                <div key={item.id} className="space-y-4">
                                    <Link
                                        to={item.url}
                                        onClick={(e) => {
                                            if (item.siblings) {
                                                e.preventDefault();
                                                setOpenSubmenu(openSubmenu === item.id ? null : item.id);
                                            }
                                        }}
                                        className="flex items-center gap-4 text-2xl font-serif font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2"
                                    >
                                        <span className="text-superia">{item.icon}</span>
                                        {item.label}
                                        {item.siblings && <ChevronDown className={clsx("ml-auto transition-transform", openSubmenu === item.id && "rotate-180")} />}
                                    </Link>
                                    
                                    {item.siblings && openSubmenu === item.id && (
                                        <div className="grid grid-cols-1 gap-4 pl-10 border-l border-superia/20">
                                            {item.siblings.map(sibling => (
                                                <Link
                                                    key={sibling.id}
                                                    to={sibling.url}
                                                    className="text-lg text-text-dim hover:text-superia font-serif"
                                                >
                                                    {sibling.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            <div className="mt-12 pt-8 border-t border-white/10 space-y-6">
                                <button onClick={() => { setNPCGeneratorOpen(true); setMobileMenuOpen(false); }} className="flex items-center gap-4 text-xl font-serif text-white/80"><UserPlus size={24} className="text-superia" /> NPC GENERATOR</button>
                                <button onClick={() => { setDMScreenOpen(true); setMobileMenuOpen(false); }} className="flex items-center gap-4 text-xl font-serif text-white/80"><BookOpen size={24} className="text-superia" /> DM SKÆRM</button>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );

    return (
        <>
            {renderDesktopSidebar()}
            {renderMobileNav()}
        </>
    );
};
