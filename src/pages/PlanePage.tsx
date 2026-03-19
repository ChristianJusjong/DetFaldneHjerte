import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SmartLink } from '@/features/lore/components/SmartLink';
import { getLore } from '@/features/lore/utils/data';
import { BookmarkButton } from '@/shared/components/BookmarkButton';
import { MysticCard } from '@/shared/components/MysticCard';
import { getIconForContinent } from '@/shared/utils/helpers';
import { MapVisualizer } from '@/features/map/components/MapVisualizer';

export const PlanePage = () => {
    // 1. Get Params
    const { planeId } = useParams<{ planeId: string }>();
    const data = getLore();

    // 2. Find Plane
    const plane = data.planes.find(p => p.id === planeId);

    if (!plane) {
        return <div className="p-8 text-white">Flade ikke fundet ({planeId})</div>;
    }

    // Determine color based on plane ID (Hardcoded distinct colors if not in JSON)
    const planeColor = plane.id === 'lyssiden' ? '#7ccef3' : '#e63946';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <MysticCard>
                {/* Header */}
                <header className="mb-8 relative">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1
                                className="font-serif text-5xl md:text-6xl font-bold mb-2 leading-tight"
                                style={{ color: planeColor }}
                            >
                                {plane.name}
                            </h1>
                            <p className="text-xl text-text-dim italic font-serif mb-4">
                                {plane.theme}
                            </p>
                        </div>
                        <BookmarkButton url={`/plane/${plane.id}`} title={plane.name} type="other" />
                    </div>
                </header>

                {/* Map Visualization */}
                <div className="mb-12 rounded-2xl overflow-hidden border border-border shadow-glass bg-black/20">
                    <MapVisualizer
                        mapImage={plane.mapImage || ''}
                        title={plane.name}
                        className="w-full"
                        pins={plane.continents
                            .filter(c => c.coordinates)
                            .map(c => ({
                                id: c.id,
                                x: c.coordinates!.x,
                                y: c.coordinates!.y,
                                label: c.name,
                                type: 'region', // Reusing region style for continents
                                link: `/continent/${c.id}`
                            }))}
                    />
                </div>

                <div className="text-lg leading-relaxed text-gray-300 space-y-4 mb-12">
                    <p><SmartLink text={plane.description || ""} /></p>
                </div>

                {/* Continents Section */}
                <h2 className="text-3xl font-serif font-bold text-white mt-16 mb-6 pb-3 border-b border-border/50">Kontinenter</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plane.continents.map(continent => (
                        <Link
                            to={`/continent/${continent.id}`}
                            key={continent.id}
                            className="block group"
                        >
                            <div
                                className="h-full bg-black/20 backdrop-blur-xl border border-border rounded-2xl p-6 transition-all duration-300 hover:bg-white/5 hover:border-superia/50 hover:-translate-y-1 shadow-glass group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-start gap-5"
                                style={{ borderLeft: `3px solid ${continent.color}` }}
                            >
                                <div className="text-4xl opacity-80 group-hover:scale-110 transition-transform">
                                    {getIconForContinent(continent.id)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 transition-colors group-hover:text-white" style={{ color: continent.color }}>
                                        {continent.name}
                                    </h3>
                                    <p className="text-text-dim italic mb-2">{continent.title}</p>
                                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                                        {continent.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </MysticCard>
        </motion.div>
    );
};
