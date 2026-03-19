import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getOrganizations, getConflict } from '@/features/lore/utils/data';
import type { Organization, Conflict } from '@/shared/types';
import { slugify } from '@/shared/utils/helpers';
import { MysticCard } from '@/shared/components/MysticCard';
import { LoreCard } from '@/shared/components/LoreCard';
import { PageHeader } from '@/shared/components/PageHeader';
import { Badge } from '@/shared/components/Badge';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

export const OrganizationsPage = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [conflict, setConflict] = useState<Conflict | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [orgsData, conflictData] = await Promise.all([
                getOrganizations(),
                getConflict()
            ]);
            setOrganizations(orgsData);
            setConflict(conflictData);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading || !conflict) {
        return <LoadingSpinner />;
    }

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
                    {organizations.map((org) => (
                        <Link
                            key={org.name}
                            to={`/lore/organization/${org.id || slugify(org.name)}`}
                            className="block no-underline group"
                        >
                            <LoreCard accentColor="superia">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <h3 className="text-2xl font-serif font-bold text-white group-hover:text-superia transition-colors tracking-wide">{org.name}</h3>
                                    <Badge className="font-main">{org.loyalty}</Badge>
                                </div>
                                <p className="text-text-main leading-relaxed line-clamp-3 font-main">{org.desc}</p>
                            </LoreCard>
                        </Link>
                    ))}
                </div>

                <h2 className="text-3xl font-serif font-bold text-white mb-8 border-b border-border/50 pb-3 tracking-wide">Fraktioner i Konflikten</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {conflict.fractions.map(f => (
                        <Link
                            key={f.name}
                            to={`/lore/conflict/${f.id || slugify(f.name)}`}
                            className="block no-underline group"
                        >
                            <LoreCard accentColor="inferia">
                                <h3 className="text-2xl font-serif font-bold text-white group-hover:text-inferia transition-colors tracking-wide">{f.name}</h3>
                                <p className="text-xs font-main text-text-main uppercase tracking-widest"><strong className="text-superia">Leder:</strong> <span className="text-white">{f.leader}</span></p>
                                <p className="text-text-main leading-relaxed line-clamp-3 font-main mt-1 text-sm">{f.goal}</p>
                            </LoreCard>
                        </Link>
                    ))}
                </div>
            </MysticCard>
        </motion.div>
    );
};
