import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getLore } from '../utils/data';
import { slugify } from '../utils/helpers';
import { MysticCard } from '../components/ui/MysticCard';
import { PageHeader } from '../components/ui/PageHeader';

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
                            <div
                                id={slugify(race.name)}
                                className="bg-white/5 rounded-2xl p-6 border-l-4 hover:bg-white/10 transition-colors h-full"
                                style={{ borderLeftColor: race.continentColor }}
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-200 transition-colors">{race.name}</h3>
                                </div>
                                <p
                                    className="text-xs uppercase tracking-widest font-bold mb-4"
                                    style={{ color: race.continentColor }}
                                >
                                    {race.continentName}
                                </p>

                                <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3">{race.description}</p>

                                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-sm text-text-dim">
                                    <span>Klik for detaljer</span>
                                    {race.reskin && <span className="opacity-50">Reskin: {race.reskin}</span>}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </MysticCard>
        </motion.div>
    );
};
