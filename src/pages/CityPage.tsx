import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Map as MapIcon, ShoppingBag, Users, Info } from 'lucide-react';
import type { City, Continent, Region } from '../types';
import { slugify } from '../utils/helpers';
import { getLore } from '../utils/data';
import { SmartLink } from '../components/SmartLink';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { BookmarkButton } from '../components/BookmarkButton';
import { MysticCard } from '../components/ui/MysticCard';
import { Badge } from '../components/ui/Badge';

export const CityPage = () => {
    const { id } = useParams<{ id: string }>();
    const data = getLore();
    const [city, setCity] = useState<City | null>(null);
    const [region, setRegion] = useState<Region | null>(null);
    const [continent, setContinent] = useState<Continent | null>(null);

    // Memoize context for SmartLinks
    const linkContext = continent ? {
        continentId: continent.id,
        regionId: region ? slugify(region.name) : undefined
    } : undefined;

    useEffect(() => {
        if (!id) return;

        let foundCity: City | null = null;
        let foundRegion: Region | null = null;
        let foundContinent: Continent | null = null;

        for (const plane of data.planes) {
            for (const cont of plane.continents) {
                for (const reg of cont.regions) {
                    const match = reg.cities.find(c => slugify(c.name) === id);
                    if (match) {
                        foundCity = match;
                        foundRegion = reg;
                        foundContinent = cont;
                        break;
                    }
                }
                if (foundCity) break;
            }
            if (foundCity) break;
        }

        if (foundCity) {
            setCity(foundCity);
            setRegion(foundRegion);
            setContinent(foundContinent);
        }
    }, [id]);

    if (!city || !continent) {
        return <div className="p-8 text-center text-white">Byen blev ikke fundet...</div>;
    }

    const continentColor = continent.color || '#fff';
    const mapPath = `/assets/cities/${slugify(city.name)}.png`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6"
        >
            <div className="w-full">
                <Link
                    to={`/continent/${continent.id}/${slugify(region?.name || '')}`}
                    className="flex items-center gap-2 text-text-dim hover:text-white transition-colors mb-6 no-underline"
                >
                    <ArrowLeft size={20} />
                    Tilbage til {region?.name}
                </Link>

                <div className="relative w-full h-80 rounded-3xl overflow-hidden mb-8 border border-white/10 shadow-premium">
                    <ImageWithFallback
                        src={mapPath}
                        alt={city.name}
                        className="w-full h-full object-cover"
                        fallbackText={`Kort over ${city.name}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-8 w-full z-10 flex justify-between items-end">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-2 leading-none" style={{ color: continentColor }}>{city.name}</h1>
                            <p className="text-white/80 font-serif italic text-lg">{region?.name}, {continent.name}</p>
                        </div>
                        <BookmarkButton url={`/continent/${continent.id}/${slugify(region?.name || '')}/${slugify(city.name)}`} title={city.name} type="city" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info Column */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <MysticCard>
                            <h3 className="flex items-center gap-2 text-xl font-bold mb-4" style={{ color: continentColor }}>
                                <Info size={18} /> Om Byen
                            </h3>
                            <p className="text-gray-300 leading-relaxed mb-6"><SmartLink text={city.desc} context={linkContext} /></p>

                            {city.layout && (
                                <div className="mb-6">
                                    <h4 className="text-lg font-bold text-white mb-2">Byens Struktur</h4>
                                    <p className="text-gray-300 leading-relaxed"><SmartLink text={city.layout} context={linkContext} /></p>
                                </div>
                            )}

                            {city.rumor && (
                                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl italic text-gray-200">
                                    <strong className="text-orange-500 not-italic mr-2">Rygte:</strong> "{city.rumor}"
                                </div>
                            )}
                        </MysticCard>

                        {/* Shops Grid */}
                        {city.shops && city.shops.length > 0 && (
                            <div className="flex flex-col gap-4">
                                <h3 className="flex items-center gap-2 text-xl font-bold ml-2" style={{ color: continentColor }}>
                                    <ShoppingBag size={18} /> Butikker & Etablissementer
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {city.shops.map((shop, i) => (
                                        <div key={i} className="bg-surface/60 border border-white/5 p-6 rounded-2xl hover:bg-surface/80 transition-all">
                                            <div className="flex justify-between items-start mb-3">
                                                <strong className="text-lg text-white">{shop.name}</strong>
                                                <Badge variant="outline">{shop.type}</Badge>
                                            </div>
                                            <p className="text-sm text-gray-400 mb-3">{shop.desc}</p>
                                            {shop.owner && <div className="text-xs text-text-dim border-t border-white/5 pt-2">Ejer: {shop.owner}</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Map Column */}
                    <div className="flex flex-col gap-8">
                        {/* Map Card */}
                        <div className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-premium">
                            <div className="p-4 border-b border-white/10 font-bold flex items-center gap-2 text-white" style={{ background: `${continentColor}20` }}>
                                <MapIcon size={16} /> Taktisk Kort
                            </div>
                            <div className="aspect-square bg-black/40">
                                <ImageWithFallback
                                    src={mapPath}
                                    alt={`Kort over ${city.name}`}
                                    className="w-full h-full object-cover"
                                    fallbackText={`Kort over ${city.name} genereres...`}
                                />
                            </div>
                        </div>

                        {/* NPCs List */}
                        {city.inhabitants && city.inhabitants.length > 0 && (
                            <MysticCard className="flex flex-col gap-4">
                                <h3 className="flex items-center gap-2 text-xl font-bold" style={{ color: continentColor }}>
                                    <Users size={18} /> Vigtige Personer
                                </h3>
                                <div className="flex flex-col gap-4">
                                    {city.inhabitants.map((npc, i) => (
                                        <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className="font-bold text-white text-lg">{npc.name}</div>
                                            <div className="text-sm font-semibold mb-2" style={{ color: continentColor }}>{npc.role}</div>
                                            <p className="text-sm text-gray-400 mb-2">{npc.desc}</p>
                                            {npc.wants && <div className="text-xs italic text-text-dim border-t border-white/10 pt-2 mt-2">Vil: {npc.wants}</div>}
                                        </div>
                                    ))}
                                </div>
                            </MysticCard>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
