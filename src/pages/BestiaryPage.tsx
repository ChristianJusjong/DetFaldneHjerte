import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import loreData from '../data/lore.json';
import type { LoreData } from '../types';
import { slugify } from '../utils/helpers';
import { MysticCard } from '../components/ui/MysticCard';
import { PageHeader } from '../components/ui/PageHeader';

export const BestiaryPage = () => {
    const data = loreData as unknown as LoreData;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <MysticCard>
                <PageHeader
                    title="Bestiarium"
                    subtitle="Monstre og Væsener"
                    titleClassName="text-green-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.bestiary?.map((beast: any) => (
                        <Link
                            key={beast.name}
                            to={`/lore/bestiary/${beast.id || slugify(beast.name)}`}
                            className="block no-underline group"
                        >
                            <div className="bg-green-500/5 border border-green-500/20 p-6 rounded-2xl group-hover:bg-green-500/10 transition-colors h-full flex flex-col">
                                <h3 className="text-2xl font-serif font-bold text-green-500 mb-3 group-hover:text-green-400 transition-colors">{beast.name}</h3>
                                <p className="text-gray-300 mb-6 leading-relaxed line-clamp-3">{beast.desc}</p>

                                <div className="bg-black/20 p-4 rounded-lg border border-white/5 mt-auto">
                                    <strong className="text-xs uppercase tracking-widest text-text-dim block mb-1">Evne</strong>
                                    <p className="text-sm text-gray-200 line-clamp-2">{beast.ability}</p>
                                </div>
                                <span className="text-xs text-green-500 mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity">Se detaljer</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </MysticCard>
        </motion.div>
    );
};
