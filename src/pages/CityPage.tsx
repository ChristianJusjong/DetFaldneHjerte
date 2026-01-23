import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Info } from 'lucide-react';
import { MapVisualizer } from '../components/world/MapVisualizer';
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
    const mapPath = city.mapImage || `/assets/cities/${slugify(city.name)}.png`;

    // Flatten assets for display in current UI structure
    // const allAssets = city.districts.flatMap(d => d.assets);
    // const shops = allAssets.filter(a => a.type === 'shop');
    // const npcs = allAssets.filter(a => a.type === 'npc');

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

                            {city.atmosphere && (
                                <div className="mb-6 pl-4 border-l-2 border-white/10 italic text-gray-400">
                                    "{city.atmosphere}"
                                </div>
                            )}

                            {city.architecture && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-text-dim uppercase tracking-wider mb-2">Arkitektur</h4>
                                    <p className="text-gray-300 leading-relaxed text-sm"><SmartLink text={city.architecture} context={linkContext} /></p>
                                </div>
                            )}

                            {city.layout && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-text-dim uppercase tracking-wider mb-2">Struktur</h4>
                                    <p className="text-gray-300 leading-relaxed text-sm"><SmartLink text={city.layout} context={linkContext} /></p>
                                </div>
                            )}

                            {city.pointsOfInterest && city.pointsOfInterest.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-text-dim uppercase tracking-wider mb-2">Interessepunkter</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {city.pointsOfInterest.map((poi, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                                                <span className="text-superia mt-1">•</span> {poi}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {city.rumor && (
                                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl italic text-gray-200">
                                    <strong className="text-orange-500 not-italic mr-2">Rygte:</strong> "{city.rumor}"
                                </div>
                            )}
                        </MysticCard>

                        {/* Districts Loop */}
                        {city.districts.map((district) => (
                            <div key={district.id} className="flex flex-col gap-6">
                                <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                                    <h3 className="text-2xl font-serif text-white">{district.name}</h3>
                                    <Badge variant="default">{district.assets.length} steder</Badge>
                                </div>

                                {district.desc && <p className="text-text-dim italic">{district.desc}</p>}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {district.assets.map((asset, i) => (
                                        <Link
                                            key={i}
                                            to={`/continent/${continent.id}/${slugify(region?.name || '')}/${slugify(city.name)}/${district.id}/${asset.id}`}
                                            className="block group"
                                        >
                                            <div className="bg-surface/60 border border-white/5 p-6 rounded-2xl group-hover:bg-surface/80 group-hover:border-white/20 transition-all h-full">
                                                <div className="flex justify-between items-start mb-3">
                                                    <strong className="text-lg text-white group-hover:text-blue-200 transition-colors">{asset.name}</strong>
                                                    <Badge variant="outline">{asset.subtype || asset.type}</Badge>
                                                </div>
                                                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{asset.desc}</p>
                                                <div className="flex items-center text-xs text-text-dim text-blue-400 group-hover:text-blue-300">
                                                    Læs mere <ArrowLeft className="rotate-180 ml-1 w-3 h-3" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar / Map Column */}
                    <div className="flex flex-col gap-8">
                        {/* Map Card */}
                        <div className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-premium">
                            <MapVisualizer
                                mapImage={mapPath}
                                scenicImage={city.image}
                                battlemapImage={city.battlemapImage}
                                title={city.name}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
