import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { SmartLink } from '../components/SmartLink';
import { slugify } from '../utils/helpers';
import { getLore } from '../utils/data';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { BookmarkButton } from '../components/BookmarkButton';
import { MysticCard } from '../components/ui/MysticCard';

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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <MysticCard>
                {/* Header */}
                <header className="mb-8 relative">
                    <Link
                        to={`/plane/${plane.id}`}
                        className="flex items-center gap-2 text-text-dim hover:text-white transition-colors mb-6 no-underline w-fit"
                    >
                        <ArrowLeft size={20} />
                        Tilbage til {plane.name}
                    </Link>

                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1
                                className="font-serif text-5xl md:text-6xl font-bold mb-2 leading-tight"
                                style={{ color: continent.color }}
                            >
                                {continent.name}
                            </h1>
                            <p className="text-xl text-text-dim italic font-serif mb-4">
                                {continent.title}
                            </p>
                        </div>
                        <BookmarkButton url={`/continent/${continent.id}`} title={continent.name} type="continent" />
                    </div>

                    {continent.culturalQuote && (
                        <div className="relative mt-4 pl-6 border-l-2 border-white/20 italic text-white/80 max-w-2xl">
                            "{continent.culturalQuote}"
                        </div>
                    )}
                </header>

                {hasImage && (
                    <div className="w-full aspect-[21/9] bg-black rounded-2xl overflow-hidden border-4 border-white/5 mb-8 shadow-2xl">
                        <ImageWithFallback src={imagePath} alt={continent.name} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500" />
                    </div>
                )}

                <div className="text-lg leading-relaxed text-gray-300 space-y-4">
                    <p><SmartLink text={continent.description} context={linkContext} /></p>
                </div>

                {/* Social Dynamics */}
                {continent.socialDynamics && (
                    <div
                        className="mt-12 p-8 rounded-2xl border backdrop-blur-sm"
                        style={{
                            backgroundColor: `${continent.color}10`, // 10% opacity hex
                            borderColor: `${continent.color}30`     // 30% opacity hex
                        }}
                    >
                        <h3
                            className="text-2xl font-serif font-bold mb-6 flex items-center gap-2"
                            style={{ color: continent.color }}
                        >
                            <SmartLink text="Social Dynamik" />
                        </h3>
                        <div className="grid gap-4">
                            {Object.entries(continent.socialDynamics).map(([key, value]) => (
                                <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                                    <strong className="text-white capitalize min-w-[120px]">{key}: </strong>
                                    <span className="text-text-dim"><SmartLink text={value} context={linkContext} /></span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Regions Section */}
                <h2 className="text-3xl font-serif font-bold text-white mt-16 mb-6 pb-2 border-b border-white/10">Regioner</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {continent.regions.map(region => (
                        <Link
                            to={`/continent/${continent.id}/${slugify(region.name)}`}
                            key={region.name}
                            className="block group"
                        >
                            <div
                                className="h-full bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:translate-x-1"
                                style={{ borderLeft: `3px solid ${continent.color}` }}
                            >
                                <h3 className="text-xl font-bold mb-2 transition-colors group-hover:text-white" style={{ color: continent.color }}>{region.name}</h3>
                                <p className="text-xs uppercase tracking-widest text-text-dim mb-3">Hovedstad: {region.capital}</p>
                                <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                                    {region.desc}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Races Section */}
                <section className="mt-16">
                    <h2 className="text-3xl font-serif font-bold text-white mb-8 pb-2 border-b border-white/10">Unikke Racer</h2>
                    <div className="grid gap-8">
                        {continent.races.map(race => (
                            <div
                                key={race.name}
                                className="pl-6 py-2"
                                style={{ borderLeft: `3px solid ${continent.color}` }}
                            >
                                <h3 className="text-2xl font-bold text-white mb-2">{race.name}</h3>
                                <p className="text-gray-300 leading-relaxed"><SmartLink text={race.description} context={linkContext} /></p>
                            </div>
                        ))}
                    </div>
                </section>
            </MysticCard>
        </motion.div>
    );
};
