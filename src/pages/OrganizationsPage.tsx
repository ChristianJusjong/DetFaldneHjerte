import { motion } from 'framer-motion';
import loreData from '../data/lore.json';
import type { LoreData } from '../types';
import { SmartLink } from '../components/SmartLink';
import { slugify } from '../utils/helpers';
import { MysticCard } from '../components/ui/MysticCard';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';

export const OrganizationsPage = () => {
    const data = loreData as unknown as LoreData;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <MysticCard>
                <PageHeader
                    title="Organisationer"
                    subtitle="Magtgrupperinger og Lav"
                    titleClassName="text-purple-500"
                />

                <div className="grid gap-6 mb-16">
                    {data.organizations?.map((org: any) => (
                        <div key={org.name} id={slugify(org.name)} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <h3 className="text-2xl font-bold text-white">{org.name}</h3>
                                <Badge>{org.loyalty}</Badge>
                            </div>
                            <p className="text-gray-300 leading-relaxed"><SmartLink text={org.desc} /></p>
                        </div>
                    ))}
                </div>

                <h2 className="text-3xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-2">Fraktioner i Konflikten</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {data.conflict.fractions.map(f => (
                        <div key={f.name} className="flex flex-col gap-2 p-6 rounded-2xl border border-inferia/20 bg-inferia/5">
                            <h3 className="text-xl font-bold text-inferia">{f.name}</h3>
                            <p className="text-sm text-gray-300"><strong>Leder:</strong> {f.leader}</p>
                            <p className="text-gray-400"><SmartLink text={f.goal} /></p>
                        </div>
                    ))}
                </div>
            </MysticCard>
        </motion.div>
    );
};
