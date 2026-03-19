import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBestiary } from '@/features/lore/utils/data';
import type { BestiaryEntry } from '@/shared/types';
import { slugify } from '@/shared/utils/helpers';
import { MysticCard } from '@/shared/components/MysticCard';
import { LoreCard } from '@/shared/components/LoreCard';
import { PageHeader } from '@/shared/components/PageHeader';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

export const BestiaryPage = () => {
    const [bestiary, setBestiary] = useState<BestiaryEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const data = await getBestiary();
            setBestiary(data);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

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
                    {bestiary.map((beast) => (
                        <Link
                            key={beast.name}
                            to={`/lore/bestiary/${beast.id || slugify(beast.name)}`}
                            className="block no-underline group"
                        >
                            <LoreCard accentColor="green">
                                <h3 className="text-2xl font-serif font-bold text-green-500 mb-3 group-hover:text-green-400 transition-colors tracking-wide">{beast.name}</h3>
                                <p className="text-text-main mb-6 leading-relaxed line-clamp-3 font-main text-sm">{beast.desc}</p>

                                <div className="bg-black/40 p-4 rounded-xl border border-border shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] font-main">
                                    <strong className="text-[10px] uppercase tracking-widest text-text-dim block mb-1">Evne</strong>
                                    <p className="text-sm text-gray-200 line-clamp-2">{beast.ability}</p>
                                </div>
                            </LoreCard>
                        </Link>
                    ))}
                </div>
            </MysticCard>
        </motion.div>
    );
};
