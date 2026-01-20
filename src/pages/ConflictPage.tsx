import { motion } from 'framer-motion';
import { SmartLink } from '../components/SmartLink';
import { getLore } from '../utils/data';
import { MysticCard } from '../components/ui/MysticCard';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';

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
                    {data.conflict.effects?.map((eff: any) => (
                        <div key={eff.name} className="bg-inferia/10 p-6 rounded-lg border-l-4 border-inferia">
                            <strong className="block text-xl text-white mb-2">{eff.name}</strong>
                            <p className="text-sm text-gray-300"><SmartLink text={eff.desc} /></p>
                        </div>
                    ))}
                </div>

                <h2 className="text-3xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-2">Fraktioner</h2>
                <div className="grid gap-8 mb-16">
                    {data.conflict.fractions.map(f => (
                        <div key={f.name} className="bg-white/5 p-6 rounded-2xl border border-white/5">
                            <h3 className="text-2xl font-bold text-inferia mb-2">{f.name}</h3>
                            <p className="text-sm font-semibold text-white mb-4">Leder: {f.leader}</p>
                            <p className="mb-3 text-gray-300"><SmartLink text={f.goal} /></p>
                            <p className="text-sm text-text-dim italic border-t border-white/10 pt-3 mt-3">Aktiver: {f.assets}</p>
                        </div>
                    ))}
                </div>

                {data.organizations && (
                    <>
                        <h2 className="text-3xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-2">Organisationer</h2>
                        <div className="grid gap-6">
                            {data.organizations.map((org: any) => (
                                <MysticCard key={org.name} className="bg-black/20" noPadding>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-bold text-white">{org.name}</h3>
                                            <Badge variant="outline">{org.loyalty}</Badge>
                                        </div>
                                        <p className="text-gray-300"><SmartLink text={org.desc} /></p>
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
