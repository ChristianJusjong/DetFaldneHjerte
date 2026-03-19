import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun } from 'lucide-react';
import { getLore } from '@/features/lore/utils/data';
import { slugify } from '@/shared/utils/helpers';
import type { LoreData } from '@/shared/types';
import { MysticCard } from '@/shared/components/MysticCard';
import { LoreCard } from '@/shared/components/LoreCard';
import { PageHeader } from '@/shared/components/PageHeader';

export const ReligionPage = () => {
    const data = getLore();
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
                        <Link
                            key={god.name}
                            to={`/lore/god/${god.id || slugify(god.name)}`}
                            className="block no-underline group"
                        >
                            <LoreCard accentColor="superia">
                                <h3 className="text-2xl font-serif font-bold mb-3 text-white tracking-wide group-hover:text-superia transition-colors font-serif">{god.name}</h3>
                                <p className="text-xs uppercase tracking-widest font-bold text-text-dim mb-5 bg-black/40 px-3 py-1 rounded-full border border-border/50">{god.domain}</p>

                                <div className="mt-auto text-superia flex flex-col items-center gap-3">
                                    <Sun size={32} className="opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500" />
                                    <p className="text-sm font-medium opacity-90 font-main"><span className="text-white/60 text-xs">Symbol:</span> {god.symbol}</p>
                                </div>
                            </LoreCard>
                        </Link>
                    ))}
                </div>
            </MysticCard>
        </motion.div>
    );
};
