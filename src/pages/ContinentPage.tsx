import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { SmartLink } from '@/features/lore/components/SmartLink';
import { slugify } from '@/shared/utils/helpers';
import { getLore } from '@/features/lore/utils/data';
import { BookmarkButton } from '@/shared/components/BookmarkButton';
import { MysticCard } from '@/shared/components/MysticCard';
import { MapVisualizer } from '@/features/map/components/MapVisualizer';

export const ContinentPage = () => {
    // 1. Get Params
    const { continentId } = useParams<{ continentId: string }>();
    const data = getLore();
    const linkContext = { continentId };

    // 2. Find Continent & Plane
    const plane = data.planes.find(p => p.continents.some(c => c.id === continentId));
    const continent = plane?.continents.find(c => c.id === continentId);

    if (!continent || !plane) {
        return <div className="p-8 text-white">Kontinent ikke fundet ({continentId})</div>;
    }

    const imagePath = `/assets/maps/${continent.id}.png`;
    const hasImage = true;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="pb-20"
        >
            <MysticCard className="border-white/5">
                {/* Modern Header Section */}
                <header className="mb-12 relative">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div className="space-y-4">
                            <Link
                                to={`/plane/${plane.id}`}
                                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-bold text-text-dim hover:text-superia transition-colors no-underline group"
                            >
                                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                Tilbage til {plane.name}
                            </Link>
                            
                            <h1
                                className="font-serif text-6xl md:text-8xl font-black mb-2 leading-none tracking-tighter uppercase drop-shadow-2xl"
                                style={{ color: continent.color }}
                            >
                                {continent.name}
                            </h1>
                            <p className="text-2xl md:text-3xl text-text-dim italic font-serif opacity-80">
                                {continent.title}
                            </p>
                        </div>
                        <div className="flex gap-4">
                           <BookmarkButton url={`/continent/${continent.id}`} title={continent.name} type="continent" />
                        </div>
                    </div>

                    {continent.culturalQuote && (
                        <div className="relative py-8 px-10 bg-white/5 border-l-4 border-superia/20 rounded-r-3xl italic text-text-main/90 max-w-4xl font-serif text-xl md:text-2xl leading-relaxed shadow-inner">
                            <span className="absolute top-4 left-4 text-6xl opacity-10 font-serif">"</span>
                            {continent.culturalQuote}
                            <span className="absolute bottom-4 right-4 text-6xl opacity-10 font-serif rotate-180">"</span>
                        </div>
                    )}
                </header>

                {hasImage && (
                    <div className="w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-premium-hover mb-16 bg-black/40 group relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
                        <MapVisualizer
                            mapImage={imagePath}
                            title={continent.name}
                            className="w-full grayscale-[0.2] group-hover:grayscale-0 transition-all duration-[2000ms]"
                            pins={continent.regions
                                .filter(r => r.coordinates)
                                .map(r => ({
                                    id: r.name,
                                    x: r.coordinates!.x,
                                    y: r.coordinates!.y,
                                    label: r.name,
                                    type: 'region',
                                    link: `/continent/${continent.id}/${slugify(r.name)}`
                                }))}
                        />
                    </div>
                )}

                <div className="text-xl md:text-2xl leading-relaxed text-text-main/90 font-serif italic mb-16 max-w-5xl">
                    <p><SmartLink text={continent.description} context={linkContext} /></p>
                </div>

                {/* Social Dynamics - Rebuilt as info grid */}
                {continent.socialDynamics && (
                    <div
                        className="mt-20 p-10 md:p-14 rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-glass flex flex-col gap-10 overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-superia/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                        
                        <h3 className="text-3xl md:text-4xl font-serif font-black tracking-[0.2em] uppercase flex items-center gap-4 text-white">
                            <span className="w-12 h-[2px] bg-superia/50" />
                            Kulturel Dynamik
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
                            {Object.entries(continent.socialDynamics).map(([key, value]) => (
                                <div key={key} className="space-y-2 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-superia/40 group-hover:bg-superia transition-colors" />
                                        <strong className="text-xs md:text-sm uppercase tracking-[0.3em] font-black text-superia/60 group-hover:text-superia transition-colors">{key}</strong>
                                    </div>
                                    <p className="text-lg text-text-main font-serif leading-relaxed pl-5 border-l border-white/5"><SmartLink text={value} context={linkContext} /></p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Regions Section - Premium Cards */}
                <div className="mt-32">
                    <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-12 tracking-[0.2em] uppercase flex items-center gap-6">
                        Regioner
                        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {continent.regions.map(region => (
                            <Link
                                to={`/continent/${continent.id}/${slugify(region.name)}`}
                                key={region.name}
                                className="block group no-underline"
                            >
                                <div
                                    className="h-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20 group-hover:-translate-y-3 shadow-glass group-hover:shadow-premium"
                                    style={{ borderTop: `4px solid ${continent.color}` }}
                                >
                                    <h3 className="text-2xl md:text-3xl font-serif font-black mb-4 transition-colors group-hover:text-white uppercase tracking-wider" style={{ color: continent.color }}>
                                        {region.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-6 opacity-60">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-text-dim">Center:</span>
                                        <span className="text-xs font-serif italic text-white">{region.capital}</span>
                                    </div>
                                    <p className="text-base text-text-dim leading-relaxed font-serif group-hover:text-text-main transition-colors line-clamp-4">
                                        {region.desc}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Races Section - Immersive Scroll */}
                <section className="mt-32">
                    <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-12 tracking-[0.2em] uppercase flex items-center gap-6">
                        Unikke Racer
                        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                    </h2>
                    
                    <div className="space-y-12">
                        {continent.races.map(race => (
                            <div
                                key={race.name}
                                className="flex flex-col md:flex-row gap-10 p-10 rounded-[3rem] bg-gradient-to-r from-white/5 to-transparent border-l-4 border-superia/30 group hover:from-white/10 transition-all duration-700"
                            >
                                <div className="space-y-4 flex-1">
                                    <h3 className="text-3xl font-serif font-black text-white tracking-widest uppercase group-hover:text-superia transition-colors">{race.name}</h3>
                                    <div className="w-16 h-1 bg-superia/20 group-hover:w-32 transition-all duration-700" />
                                    <p className="text-xl text-text-dim leading-relaxed font-serif italic group-hover:text-text-main transition-colors">
                                        <SmartLink text={race.description} context={linkContext} />
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </MysticCard>
        </motion.div>
    );
};
