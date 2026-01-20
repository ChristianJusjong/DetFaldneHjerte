import { motion } from 'framer-motion';
import { Sun } from 'lucide-react';
import loreData from '../data/lore.json';
import { slugify } from '../utils/helpers';
import type { LoreData } from '../types';
import { MysticCard } from '../components/ui/MysticCard';
import { PageHeader } from '../components/ui/PageHeader';

export const ReligionPage = () => {
    const data = loreData as unknown as LoreData;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <MysticCard>
                <PageHeader
                    title={data.religion.name}
                    subtitle="Titanens Sidste Hjerteslag"
                    titleClassName="text-superia"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.religion.gods.map(god => (
                        <div
                            key={god.name}
                            id={slugify(god.name)}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors scroll-mt-24"
                        >
                            <h3 className="text-xl font-bold mb-2 text-white">{god.name}</h3>
                            <p className="text-xs uppercase tracking-widest text-text-dim mb-4">{god.domain}</p>

                            <div className="mt-4 text-superia flex flex-col items-center gap-2">
                                <Sun size={32} className="opacity-80" />
                                <p className="text-sm font-medium opacity-90">Symbol: {god.symbol}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </MysticCard>
        </motion.div>
    );
};
