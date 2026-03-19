import { motion } from 'framer-motion';
import { getLore } from '@/features/lore/utils/data';
import { SmartLink } from '@/features/lore/components/SmartLink';
import { MysticCard } from '@/shared/components/MysticCard';
import { PageHeader } from '@/shared/components/PageHeader';
import { Badge } from '@/shared/components/Badge';
import { TravelCalculator } from '@/features/travel/components/TravelCalculator';

export const TravelPage = () => {
    const data = getLore();
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
        >
            <MysticCard>
                <PageHeader
                    title="Rejse i Cor"
                    subtitle="Fra Hoved til Krop"
                    titleClassName="text-yellow-500"
                />

                <div className="flex flex-col gap-8">
                    {/* New Calculator */}
                    <TravelCalculator />

                    <h2 className="text-2xl font-bold text-white mt-8 px-2">Kendte Rejseruter</h2>
                    {data.travel.map(t => (
                        <div key={t.name} className="p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/10">
                            <h3 className="text-2xl font-serif font-bold text-yellow-500 mb-2">{t.name}</h3>
                            <p className="text-gray-300 leading-relaxed"><SmartLink text={t.desc} /></p>
                            {t.cost && (
                                <div className="mt-4 flex items-center gap-2">
                                    <Badge variant="gold">Pris</Badge>
                                    <span className="text-sm text-yellow-500/80">{t.cost}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </MysticCard>
        </motion.div>
    );
};
