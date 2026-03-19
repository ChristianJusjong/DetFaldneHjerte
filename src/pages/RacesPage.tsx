import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getLore } from '@/features/lore/utils/data';
import { slugify } from '@/shared/utils/helpers';
import { MysticCard } from '@/shared/components/MysticCard';
import { LoreCard } from '@/shared/components/LoreCard';
import { PageHeader } from '@/shared/components/PageHeader';

export const RacesPage = () => {
    const data = getLore();
    // Flat list of all races with continent info
    const allRaces = data.planes.flatMap(p =>
        p.continents.flatMap(c =>
            c.races.map(r => ({ ...r, continentName: c.name, continentColor: c.color }))
        )
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <MysticCard>
                <PageHeader
                    title="Racer i Cor"
                    subtitle="Folkeslagene på de to flader"
                    titleClassName="text-orange-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {allRaces.map(race => (
                        <Link
                            key={race.name}
                            to={`/lore/race/${race.id || slugify(race.name)}`}
                            className="block no-underline group"
                        >
                            <LoreCard accentColor="custom" customColor={race.continentColor}>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-blue-200 transition-colors tracking-wide">{race.name}</h3>
                                </div>
                                <p
                                    className="text-xs uppercase tracking-widest font-bold mb-4"
                                    style={{ color: race.continentColor }}
                                >
                                    {race.continentName}
                                </p>

                                <p className="text-text-main mb-4 leading-relaxed line-clamp-3 font-main text-sm">{race.description}</p>

                                <div className="mt-auto pt-5 border-t border-border/50 flex justify-between items-center text-xs text-text-dim font-main">
                                    <span className="group-hover:text-superia transition-colors font-semibold">Detaljer</span>
                                    {race.reskin && <span className="opacity-60 bg-black/40 px-2 py-1 rounded">Reskin: {race.reskin}</span>}
                                </div>
                            </LoreCard>
                        </Link>
                    ))}
                </div>
            </MysticCard>
        </motion.div>
    );
};
