import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import loreData from '../data/lore.json';
import type { LoreData } from '../types';
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
                    {data.organizations?.map((org) => (
                        <Link
                            key={org.name}
                            to={`/lore/organization/${org.id || slugify(org.name)}`}
                            className="block no-underline group"
                        >
                            <div id={slugify(org.name)} className="bg-white/5 p-6 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">{org.name}</h3>
                                    <Badge>{org.loyalty}</Badge>
                                </div>
                                <p className="text-gray-300 leading-relaxed line-clamp-3">{org.desc}</p>
                                <span className="text-xs text-blue-400 mt-2 block underline opacity-0 group-hover:opacity-100 transition-opacity">Læs mere</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <h2 className="text-3xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-2">Fraktioner i Konflikten</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {data.conflict.fractions.map(f => (
                        <Link
                            key={f.name}
                            to={`/lore/conflict/${f.id || slugify(f.name)}`} // Assuming we treat factions as conflict entities or similar
                            className="block no-underline group"
                        >
                            <div className="flex flex-col gap-2 p-6 rounded-2xl border border-inferia/20 bg-inferia/5 group-hover:bg-inferia/10 transition-colors h-full">
                                <h3 className="text-xl font-bold text-inferia group-hover:text-inferia-light">{f.name}</h3>
                                <p className="text-sm text-gray-300"><strong>Leder:</strong> {f.leader}</p>
                                <p className="text-gray-400 line-clamp-3">{f.goal}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </MysticCard>
        </motion.div>
    );
};
