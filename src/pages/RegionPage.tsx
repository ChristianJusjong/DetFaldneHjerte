import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Map as MapIcon, Warehouse } from 'lucide-react';
import { SmartLink } from '../components/SmartLink';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { slugify } from '../utils/helpers';
import { getLore } from '../utils/data';
import { BookmarkButton } from '../components/BookmarkButton';
import { MysticCard } from '../components/ui/MysticCard';

export const RegionPage = () => {
    const { continentId, regionId } = useParams<{ continentId: string; regionId: string }>();
    const navigate = useNavigate();
    const data = getLore();
    const linkContext = { continentId, regionId };

    // 1. Find Continent
    const continent = data.planes
        .flatMap(p => p.continents)
        .find(c => c.id === continentId);

    if (!continent) {
        return <div className="p-8 text-white">Kontinent ikke fundet (ID: {continentId})</div>;
    }

    // 2. Find Region
    const region = continent.regions.find(r => slugify(r.name) === regionId);

    if (!region) {
        return <div className="p-8 text-white">Region ikke fundet (ID: {regionId}) i {continent.name}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        >
            <MysticCard>
                <button
                    onClick={() => navigate(`/continent/${continentId}`)}
                    className="flex items-center gap-2 text-text-dim hover:text-white transition-colors mb-6 text-base bg-transparent border-none cursor-pointer"
                >
                    <ArrowLeft size={18} /> Tilbage til {continent.name}
                </button>

                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-2">
                        <MapIcon size={32} className="text-superia" />
                        <h1 className="font-serif text-5xl md:text-6xl font-bold text-white m-0">
                            {region.name}
                        </h1>
                        <BookmarkButton url={`/continent/${continent.id}/${slugify(region.name)}`} title={region.name} type="region" />
                    </div>
                    <p className="text-xl text-text-dim italic font-serif ml-14">Region i {continent.name}</p>
                </div>

                <div className="mb-8">
                    <div className="flex flex-wrap gap-8 mb-8">
                        <div className="flex-1 min-w-[300px]">
                            <div className="p-6 bg-white/5 rounded-xl border border-white/10 mb-6">
                                <div className="flex justify-between mb-2">
                                    <span className="text-text-dim">Hovedstad:</span>
                                    <span className="text-superia font-semibold">{region.capital}</span>
                                </div>
                            </div>

                            <p className="text-lg leading-relaxed text-gray-200">
                                <SmartLink text={region.desc} context={linkContext} />
                            </p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-white border-b border-white/10 pb-2 mb-6 flex items-center gap-3">
                        <Warehouse size={24} /> Byer i {region.name}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {region.cities.map(city => (
                            <Link
                                key={city.name}
                                to={`/continent/${continentId}/${regionId}/${slugify(city.name)}`}
                                className="block no-underline h-full group"
                            >
                                <motion.div
                                    className="h-full p-6 bg-surface/50 backdrop-blur-md rounded-2xl border border-white/10 hover:border-superia/50 hover:bg-surface/80 transition-all shadow-lg"
                                    whileHover={{ scale: 1.02, translateY: -5 }}
                                >
                                    <div className="h-48 mb-4 overflow-hidden rounded-lg bg-black/40">
                                        <ImageWithFallback
                                            src={city.mapImage || `/assets/cities/${slugify(city.name)}.png`}
                                            alt={city.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            fallbackText={city.name}
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-superia transition-colors">{city.name}</h3>
                                    <p className="text-sm text-text-dim line-clamp-3">
                                        {city.desc}
                                    </p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </MysticCard>
        </motion.div>
    );
};
