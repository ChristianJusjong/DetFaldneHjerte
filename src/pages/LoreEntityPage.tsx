import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Skull, Users, Shield, Globe } from 'lucide-react';
import { getLore } from '../utils/data';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { MysticCard } from '../components/ui/MysticCard';
import { Badge } from '../components/ui/Badge';

export const LoreEntityPage = () => {
    const { type, id } = useParams<{ type: string; id: string }>();


    const entity = useMemo(() => {
        const data = getLore();
        let found: any = null;

        if (type === 'god') {
            found = data.religion.gods.find(g => g.id === id);
            if (found) found = { ...found, _typeLabel: "Guddom" };
        } else if (type === 'organization') {
            found = data.organizations?.find(o => o.id === id);
            if (found) found = { ...found, _typeLabel: "Organisation" };
        } else if (type === 'race') {
            data.planes.forEach(p => p.continents.forEach(c => {
                const r = c.races.find(r => r.id === id);
                if (r) found = { ...r, _typeLabel: "Race" };
            }));
        } else if (type === 'bestiary') {
            found = data.bestiary?.find(b => b.id === id);
            if (found) found = { ...found, _typeLabel: "Bæst" };
        } else if (type === 'conflict') {
            if (id === 'main') {
                found = { ...data.conflict, _typeLabel: "Konflikt" };
            } else {
                found = data.conflict.fractions.find(f => f.id === id);
                if (found) found = { ...found, _typeLabel: "Fraktion" };
            }
        }
        return found;
    }, [type, id]);

    if (!entity) return <div className="p-12 text-center text-white/50">Ingen optegnelser fundet...</div>;

    const getIcon = () => {
        if (type === 'god') return <BookOpen />;
        if (type === 'bestiary') return <Skull />;
        if (type === 'organization') return <Shield />;
        if (type === 'race') return <Users />;
        if (type === 'conflict' && entity?._typeLabel === 'Fraktion') return <Shield />; // Faction
        return <Globe />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto flex flex-col gap-8"
        >
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-surface/50">
                <div className="h-48 md:h-64 bg-gradient-to-r from-indigo-900 to-purple-900 relative">
                    {entity.image && (
                        <ImageWithFallback
                            src={entity.image}
                            alt={entity.name}
                            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                            fallbackText={entity.name}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-8 w-full flex items-end justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 text-white shadow-lg">
                                {getIcon()}
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">{entity.name}</h1>
                                <Badge>{entity._typeLabel?.toUpperCase() || type?.toUpperCase()}</Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <MysticCard>
                        <h3 className="text-xl font-bold text-white mb-4">Beskrivelse</h3>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            {entity.desc || entity.description}
                        </p>
                    </MysticCard>

                    {/* Dynamic Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {entity.domain && (
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="text-text-dim text-sm uppercase tracking-wider mb-1">Domæne</div>
                                <div className="text-white font-serif text-xl">{entity.domain}</div>
                            </div>
                        )}
                        {entity.symbol && (
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="text-text-dim text-sm uppercase tracking-wider mb-1">Symbol</div>
                                <div className="text-white font-serif text-xl">{entity.symbol}</div>
                            </div>
                        )}
                        {entity.leader && (
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="text-text-dim text-sm uppercase tracking-wider mb-1">Leder</div>
                                <div className="text-white font-serif text-xl">{entity.leader}</div>
                            </div>
                        )}
                        {entity.loyalty && (
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="text-text-dim text-sm uppercase tracking-wider mb-1">Loyalitet</div>
                                <div className="text-white font-serif text-xl">{entity.loyalty}</div>
                            </div>
                        )}
                        {entity.goal && (
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 col-span-full">
                                <div className="text-text-dim text-sm uppercase tracking-wider mb-1">Mål</div>
                                <p className="text-white">{entity.goal}</p>
                            </div>
                        )}
                        {entity.ability && (
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 col-span-full">
                                <div className="text-text-dim text-sm uppercase tracking-wider mb-1">Evner</div>
                                <p className="text-white">{entity.ability}</p>
                            </div>
                        )}
                        {entity.mechanic && (
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 col-span-full">
                                <div className="text-text-dim text-sm uppercase tracking-wider mb-1">Spilmekanik</div>
                                <p className="text-white">{entity.mechanic}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
