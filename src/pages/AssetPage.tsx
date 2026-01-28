import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, ShoppingBag, Shield, MapPin, Info, MessageSquare } from 'lucide-react';
import type { Asset, City, District } from '../types';
import { slugify } from '../utils/helpers';
import { getLore } from '../utils/data';
import { MysticCard } from '../components/ui/MysticCard';
import { Badge } from '../components/ui/Badge';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const AssetPage = () => {
    // ... (rest of component) ...
    // Fix Badge variant lower down
    // Since replace_file_content replaces a chunk, I need to target the import block first.

    // URL could be: /continent/:cid/:rid/:cityId/:districtId/:assetType/:assetId
    // Or simpler: /asset/:assetId (but we want context navigation)
    // Let's assume nested routing based on the plan
    const { continentId, regionId, cityId, districtId, assetId } = useParams<{
        continentId: string;
        regionId: string;
        cityId: string;
        districtId: string;
        assetId: string;
    }>();

    const data = getLore();
    const [asset, setAsset] = useState<Asset | null>(null);
    const [district, setDistrict] = useState<District | null>(null);
    const [city, setCity] = useState<City | null>(null);

    const [showToken, setShowToken] = useState(false);

    useEffect(() => {
        if (!cityId || !districtId || !assetId) return;

        // Find the node
        // In a real app with database, we'd fetch directly. Here we traverse.
        let foundCity: City | null = null;

        for (const plane of data.planes) {
            for (const cont of plane.continents) {
                if (cont.id !== continentId && slugify(cont.name) !== continentId) continue;

                for (const reg of cont.regions) {
                    const c = reg.cities.find(c => slugify(c.name) === cityId);
                    if (c) {
                        foundCity = c;
                        break;
                    }
                }
                if (foundCity) break;
            }
            if (foundCity) break;
        }

        if (foundCity) {
            setCity(foundCity);
            const d = foundCity.districts.find((d: District) => d.id === districtId || slugify(d.name) === districtId);
            setDistrict(d || null);

            if (d) {
                const a = d.assets.find((a: Asset) => a.id === assetId || slugify(a.name) === assetId);
                setAsset(a || null);
            }
        }

    }, [cityId, districtId, assetId, data.planes, continentId, regionId]); // Added dependencies

    if (!asset || !city) {
        return <div className="p-12 text-center text-white/60">Asset ikke fundet...</div>;
    }

    const getIcon = () => {
        switch (asset.type) {
            case 'shop': return <ShoppingBag size={24} />;
            case 'npc': return <User size={24} />;
            case 'guard': return <Shield size={24} />;
            default: return <MapPin size={24} />;
        }
    };

    // Determine background image: Interior > City District > City
    const headerBg = asset.interiorImage || district?.image || city.image;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 max-w-5xl mx-auto mb-20"
        >
            <Link
                to={`/continent/${continentId}/${regionId}/${cityId}`}
                className="flex items-center gap-2 text-text-dim hover:text-white transition-colors"
            >
                <ArrowLeft size={20} />
                Tilbage til {city.name}
            </Link>

            {/* HERO HEADER */}
            <div className="relative rounded-3xl overflow-visible border border-white/10 bg-surface/50 mt-8">
                {/* Background Image Container */}
                <div className="h-64 md:h-80 bg-gradient-to-r from-slate-900 to-slate-800 relative rounded-t-3xl overflow-hidden">
                    {headerBg && (
                        <ImageWithFallback
                            src={headerBg}
                            alt={asset.name}
                            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                            fallbackText={asset.name}
                        />
                    )}

                    {/* Interior Label */}
                    {asset.interiorImage && (
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider border border-white/10">
                            Interior View
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-surface via-surface/80 to-transparent h-32 md:h-48" />
                </div>

                {/* Content Overlay with Portrait */}
                <div className="px-8 pb-8 -mt-20 md:-mt-32 relative flex flex-col md:flex-row items-end gap-6">
                    {/* Portrait / Avatar Card */}
                    <div className="relative group shrink-0 mx-auto md:mx-0">
                        <div className="w-48 h-64 md:w-56 md:h-80 rounded-2xl border-4 border-surface shadow-2xl overflow-hidden bg-black/40 relative">
                            {asset.image ? (
                                <ImageWithFallback
                                    src={showToken && asset.tokenImage ? asset.tokenImage : asset.image}
                                    alt={asset.name}
                                    className={`w-full h-full object-cover transition-all duration-500 ${showToken ? 'p-4' : ''}`}
                                    fallbackText={asset.name}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20">
                                    {getIcon()}
                                </div>
                            )}

                            {/* Token Toggle */}
                            {asset.tokenImage && (
                                <button
                                    onClick={() => setShowToken(!showToken)}
                                    className="absolute bottom-2 right-2 p-2 bg-black/60 hover:bg-superia text-white rounded-lg backdrop-blur-md transition-colors border border-white/10"
                                    title="Toggle Token View"
                                >
                                    {showToken ? <User size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Text Info */}
                    <div className="flex-1 text-center md:text-left mb-2">
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-2">
                            <Badge className="bg-superia/20 text-superia border-superia/30">{asset.type.toUpperCase()}</Badge>
                            {asset.subtype && <Badge variant="outline">{asset.subtype}</Badge>}
                            {district && <Badge variant="default">{district.name}</Badge>}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 shadow-black drop-shadow-lg">{asset.name}</h1>
                        <p className="text-xl text-gray-300 max-w-2xl">{asset.desc.split('.')[0]}.</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="p-8 pt-0 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        <section className="bg-white/5 p-6 rounded-2xl border border-white/5">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <Info size={18} /> Beskrivelse
                            </h3>
                            <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                                {asset.desc}
                            </p>
                            {asset.appearance && (
                                <div className="mt-6 flex gap-4 items-start">
                                    <div className="w-1 bg-superia/50 self-stretch rounded-full" />
                                    <div>
                                        <div className="text-xs text-superia uppercase tracking-widest font-bold mb-1">Fremtoning</div>
                                        <p className="text-gray-400 italic">"{asset.appearance}"</p>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* SHOP: Inventory */}
                        {asset.inventory && asset.inventory.length > 0 && (
                            <MysticCard>
                                <h4 className="font-bold text-white mb-6 flex items-center gap-2 text-xl">
                                    <ShoppingBag size={20} /> Varekatalog
                                </h4>
                                <div className="overflow-hidden rounded-xl border border-white/5 bg-black/20">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-white/5 text-text-dim uppercase tracking-wider font-semibold">
                                            <tr>
                                                <th className="p-3">Vare</th>
                                                <th className="p-3 text-right">Pris</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {asset.inventory.map((item, idx) => (
                                                <tr key={idx} className="group hover:bg-white/5 transition-colors">
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-3">
                                                            {item.image && (
                                                                <div className="w-10 h-10 rounded bg-black/50 overflow-hidden border border-white/10 shrink-0">
                                                                    <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="font-bold text-white group-hover:text-superia transition-colors">{item.name}</div>
                                                                {item.desc && <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.desc}</div>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-right font-mono text-superia whitespace-nowrap">
                                                        {item.price}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </MysticCard>
                        )}

                        {/* NPC: Stats & Role */}
                        {(asset.type === 'npc' || asset.type === 'guard' || asset.stats) && (
                            <MysticCard>
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <Shield size={18} /> {asset.type === 'guard' ? 'Vagt Detaljer' : 'Karakter Data'}
                                </h4>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {asset.role && (
                                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                                <div className="text-xs text-text-dim uppercase tracking-wider mb-1">Rolle</div>
                                                <div className="text-white font-medium">{asset.role}</div>
                                            </div>
                                        )}
                                        {asset.wants && (
                                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                                <div className="text-xs text-text-dim uppercase tracking-wider mb-1">Motivation</div>
                                                <div className="text-white italic">"{asset.wants}"</div>
                                            </div>
                                        )}
                                    </div>

                                    {asset.stats && (
                                        <div className="grid grid-cols-6 gap-2 mt-4 text-center select-none">
                                            {Object.entries(asset.stats).map(([stat, val]) => (
                                                <div key={stat} className="bg-black/40 rounded-lg p-2 border border-white/5 flex flex-col items-center">
                                                    <div className="text-[10px] text-text-dim uppercase tracking-wider font-bold mb-1">{stat}</div>
                                                    <div className="font-mono text-white text-xl">{val}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </MysticCard>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Sidebar Info */}
                    <div className="space-y-6">
                        {/* SHOPKEEPER / OWNER CARD */}
                        {(asset.shopkeeper || asset.owner) && (
                            <div className="bg-surface/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">
                                <h4 className="text-xs text-text-dim uppercase tracking-wider font-bold mb-4 flex items-center gap-2">
                                    <User size={14} /> {asset.shopkeeper ? 'Indehaver' : 'Ejer'}
                                </h4>

                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 shrink-0 rounded-xl bg-superia/20 flex items-center justify-center text-superia border border-superia/30 overflow-hidden relative">
                                        {asset.shopkeeper?.image ? (
                                            <ImageWithFallback src={asset.shopkeeper.image} alt={asset.shopkeeper.name} className="w-full h-full object-cover" fallbackText="" />
                                        ) : (
                                            <User size={24} />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-xl font-bold text-white leading-tight break-words">
                                            {asset.shopkeeper?.name || asset.owner}
                                        </div>
                                        {asset.shopkeeper?.desc && <div className="text-xs text-superia mt-1">{asset.shopkeeper.desc.split('.')[0]}</div>}
                                    </div>
                                </div>

                                {asset.shopkeeper && (
                                    <div className="space-y-3 text-sm border-t border-white/10 pt-4 mt-2">
                                        <p className="text-gray-300 leading-relaxed">{asset.shopkeeper.desc}</p>
                                        {asset.shopkeeper.quirk && (
                                            <div className="bg-black/30 p-3 rounded-lg border-l-2 border-yellow-500 text-yellow-200/90 italic text-xs">
                                                "{asset.shopkeeper.quirk}"
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* RUMORS Placeholder */}
                        <div className="bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/20">
                            <div className="text-sm text-indigo-300 font-bold mb-3 flex items-center gap-2">
                                <MessageSquare size={14} /> Rygtet siger...
                            </div>
                            <p className="text-sm text-indigo-100/70 italic leading-relaxed">
                                "Der hviskes i krogene om dette steds sande natur..."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
