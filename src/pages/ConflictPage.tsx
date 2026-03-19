import { motion } from 'framer-motion';
import { SmartLink } from '@/features/lore/components/SmartLink';
import { getLore } from '@/features/lore/utils/data';
import { MysticCard } from '@/shared/components/MysticCard';
import { PageHeader } from '@/shared/components/PageHeader';
import { Badge } from '@/shared/components/Badge';

export const ConflictPage = () => {
    const data = getLore();
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <MysticCard>
                <PageHeader
                    title={data.conflict.title}
                    subtitle="Den Autoimmune Krise"
                    titleClassName="text-inferia"
                />

                <div className="mb-12 text-lg text-gray-200">
                    <p><SmartLink text={data.conflict.description} /></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {data.conflict.effects?.map((eff) => (
                        <div key={eff.name} className="bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-border shadow-glass border-l-4 border-l-inferia font-main">
                            <strong className="block text-xl font-serif text-white mb-2 tracking-wide">{eff.name}</strong>
                            <p className="text-sm text-text-main leading-relaxed"><SmartLink text={eff.desc} /></p>
                        </div>
                    ))}
                </div>

                <h2 className="text-3xl font-serif font-bold text-white mb-8 border-b border-border/50 pb-3 tracking-wide">Fraktioner</h2>
                <div className="grid gap-8 mb-16">
                    {data.conflict.fractions.map(f => (
                        <div key={f.name} className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-border shadow-glass font-main">
                            <h3 className="text-2xl font-serif font-bold text-inferia mb-3 tracking-wide">{f.name}</h3>
                            <p className="text-sm font-semibold text-text-main mb-4">Leder: <span className="text-white">{f.leader}</span></p>
                            <p className="mb-4 text-gray-300 leading-relaxed"><SmartLink text={f.goal} /></p>
                            <p className="text-sm text-text-dim italic border-t border-border/50 pt-4 mt-2">Aktiver: {f.assets}</p>
                        </div>
                    ))}
                </div>

                {data.organizations && (
                    <>
                        <h2 className="text-3xl font-serif font-bold text-white mb-8 border-b border-border/50 pb-3 tracking-wide">Organisationer</h2>
                        <div className="grid gap-6">
                            {data.organizations.map((org) => (
                                <MysticCard key={org.name} className="bg-black/20" noPadding>
                                    <div className="p-6 font-main">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-serif font-bold text-white tracking-wide">{org.name}</h3>
                                            <Badge variant="outline" className="border-border/50">{org.loyalty}</Badge>
                                        </div>
                                        <p className="text-text-main leading-relaxed text-sm"><SmartLink text={org.desc} /></p>
                                    </div>
                                </MysticCard>
                            ))}
                        </div>
                    </>
                )}
            </MysticCard>
        </motion.div>
    );
};
