import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Info } from 'lucide-react';
import { MapVisualizer } from '@/features/map/components/MapVisualizer';
import type { City, Continent, Region } from '@/shared/types';
import { slugify } from '@/shared/utils/helpers';
import { getLore } from '@/features/lore/utils/data';
import { SmartLink } from '@/features/lore/components/SmartLink';
import { ImageWithFallback } from '@/shared/components/ImageWithFallback';
import { BookmarkButton } from '@/shared/components/BookmarkButton';
import { MysticCard } from '@/shared/components/MysticCard';
import { Badge } from '@/shared/components/Badge';

export const CityPage = () => {
    const { cityId } = useParams<{ cityId: string }>();
    const data = getLore();

    let city: City | null = null;
    let region: Region | null = null;
    let continent: Continent | null = null;

    if (cityId) {
        let foundCity: City | null = null;
        for (const plane of data.planes) {
            if (!plane.continents) continue;
            for (const cont of plane.continents) {
                if (!cont.regions) continue;
                for (const reg of cont.regions) {
                    const match = reg.cities?.find(c => slugify(c.name) === cityId);
                    if (match) {
                        foundCity = match;
                        region = reg;
                        continent = cont;
                        break;
                    }
                }
                if (foundCity) break;
            }
            if (foundCity) break;
        }
        city = foundCity;
    }

    // Memoize context for SmartLinks
    const linkContext = continent ? {
        continentId: continent.id,
        regionId: region ? slugify(region.name) : undefined
    } : undefined;

    if (!city || !continent) {
        return <div className="p-8 text-center text-white">Byen blev ikke fundet...</div>;
    }

    const continentColor = continent.color || '#fff';
    const mapPath = city.mapImage || `/assets/cities/${slugify(city.name)}.png`;
    const heroImage = city.image || mapPath;

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
                    className="flex items-center gap-2 text-text-dim hover:text-superia transition-colors mb-6 no-underline font-main font-medium"
                >
                    <ArrowLeft size={18} />
                    Tilbage til {region?.name}
                </Link>

                <div className="relative w-full h-80 rounded-2xl overflow-hidden mb-10 border border-border shadow-glass">
                    <ImageWithFallback
                        src={heroImage}
                        alt={city.name}
                        className="w-full h-full object-cover"
                        fallbackText={`Kort over ${city.name}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-8 w-full z-10 flex justify-between items-end">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-2 leading-none tracking-wide" style={{ color: continentColor }}>{city.name}</h1>
                            <p className="text-white/80 font-main italic text-lg">{region?.name}, {continent.name}</p>
                        </div>
                        <BookmarkButton url={`/continent/${continent.id}/${slugify(region?.name || '')}/${slugify(city.name)}`} title={city.name} type="city" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info Column */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <MysticCard>
                            <h3 className="flex items-center gap-2 text-2xl font-serif font-bold mb-5 tracking-wide" style={{ color: continentColor }}>
                                <Info size={22} className="text-superia" /> Om Byen
                            </h3>
                            <p className="text-text-main leading-relaxed mb-8 font-main"><SmartLink text={city.desc} context={linkContext} /></p>

                            {city.atmosphere && (
                                <div className="mb-8 pl-6 border-l-[3px] border-superia/30 italic text-text-dim font-serif text-lg py-1">
                                    "{city.atmosphere}"
                                </div>
                            )}

                            {city.architecture && (
                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-superia uppercase tracking-widest mb-2 font-main">Arkitektur</h4>
                                    <p className="text-text-main leading-relaxed text-sm font-main"><SmartLink text={city.architecture} context={linkContext} /></p>
                                </div>
                            )}

                            {city.layout && (
                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-superia uppercase tracking-widest mb-2 font-main">Struktur</h4>
                                    <p className="text-text-main leading-relaxed text-sm font-main"><SmartLink text={city.layout} context={linkContext} /></p>
                                </div>
                            )}

                            {city.pointsOfInterest && city.pointsOfInterest.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-superia uppercase tracking-widest mb-3 font-main">Interessepunkter</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {city.pointsOfInterest.map((poi, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-text-main font-main">
                                                <span className="text-superia mt-0.5 opacity-80">•</span> {poi}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {city.rumor && (
                                <div className="p-5 bg-superia/5 border border-superia/20 rounded-2xl italic text-text-main shadow-glass mt-8">
                                    <strong className="text-superia not-italic mr-2 font-main font-semibold">Rygte:</strong> <span className="font-serif">"{city.rumor}"</span>
                                </div>
                            )}
                        </MysticCard>

                        {/* Districts Loop */}
                        {city.districts.map((district) => (
                            <div key={district.id} className="flex flex-col gap-6 mt-4">
                                <div className="flex items-center gap-4 border-b border-border/50 pb-3">
                                    <h3 className="text-3xl font-serif text-white">{district.name}</h3>
                                    <Badge variant="default" className="text-xs">{district.assets.length} steder</Badge>
                                </div>

                                {district.desc && <p className="text-text-main font-main italic leading-relaxed">{district.desc}</p>}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {district.assets.map((asset, i) => (
                                        <Link
                                            key={i}
                                            to={`/continent/${continent.id}/${slugify(region?.name || '')}/${slugify(city.name)}/${district.id}/${asset.id}`}
                                            className="block group"
                                        >
                                            <div className="bg-black/20 backdrop-blur-xl border border-border p-6 rounded-2xl group-hover:bg-white/5 group-hover:border-superia/50 transition-all h-full shadow-glass group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:-translate-y-1">
                                                <div className="flex justify-between items-start mb-3">
                                                    <strong className="text-xl font-serif text-white group-hover:text-superia transition-colors tracking-wide">{asset.name}</strong>
                                                    <Badge variant="outline" className="border-border/50 text-text-dim">{asset.subtype || asset.type}</Badge>
                                                </div>
                                                <p className="text-sm text-text-main mb-4 font-main line-clamp-2 leading-relaxed">{asset.desc}</p>
                                                <div className="flex items-center text-xs font-main font-semibold text-superia opacity-80 group-hover:opacity-100 transition-opacity">
                                                    Læs mere <ArrowLeft className="rotate-180 ml-1.5 w-3 h-3" />
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
                        <div className="bg-black/20 backdrop-blur-xl border border-border rounded-2xl overflow-hidden shadow-glass sticky top-24">
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
