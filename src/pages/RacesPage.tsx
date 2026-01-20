import { motion } from 'framer-motion';
import { SmartLink } from '../components/SmartLink';
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
                        <div
                            key={race.name}
                            id={slugify(race.name)}
                            className="bg-white/5 rounded-2xl p-6 border-l-4 hover:bg-white/10 transition-colors"
                            style={{ borderLeftColor: race.continentColor }}
                        >
                            <h3 className="text-xl font-bold text-white mb-1">{race.name}</h3>
                            <p
                                className="text-xs uppercase tracking-widest font-bold mb-4"
                                style={{ color: race.continentColor }}
                            >
                                {race.continentName}
                            </p>

                            <p className="text-gray-300 mb-4 leading-relaxed"><SmartLink text={race.description} /></p>

                            {race.reskin && (
                                <div className="bg-white/5 p-3 rounded text-sm text-gray-400 mb-3 border border-white/5">
                                    <strong className="text-gray-200">Reskin:</strong> {race.reskin}
                                </div>
                            )}

                            <p className="text-sm italic text-text-dim border-t border-white/10 pt-3 mt-3">
                                <strong className="text-gray-400 not-italic">Mekanik:</strong> {race.mechanic}
                            </p>
                        </div>
                    ))}
                </div>
            </MysticCard>
        </motion.div>
    );
};
