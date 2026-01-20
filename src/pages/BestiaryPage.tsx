import { motion } from 'framer-motion';
import loreData from '../data/lore.json';
import type { LoreData } from '../types';
import { SmartLink } from '../components/SmartLink';
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
                        <div key={beast.name} className="bg-green-500/5 border border-green-500/20 p-6 rounded-2xl hover:bg-green-500/10 transition-colors">
                            <h3 className="text-2xl font-serif font-bold text-green-500 mb-3">{beast.name}</h3>
                            <p className="text-gray-300 mb-6 leading-relaxed"><SmartLink text={beast.desc} /></p>

                            <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                                <strong className="text-xs uppercase tracking-widest text-text-dim block mb-1">Evne</strong>
                                <p className="text-sm text-gray-200"><SmartLink text={beast.ability} /></p>
                            </div>
                        </div>
                    ))}
                </div>
            </MysticCard>
        </motion.div>
    );
};
