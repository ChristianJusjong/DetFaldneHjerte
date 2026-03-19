import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Scroll } from 'lucide-react';
import { SmartLink } from '@/features/lore/components/SmartLink';
import { getLore } from '@/features/lore/utils/data';
import { MysticCard } from '@/shared/components/MysticCard';

export const HomePage = () => {
    const data = getLore();
    // Get a random rumor on mount
    const [rumor] = useState<{ text: string; city: string; region: string } | null>(() => {
        const allRumors: { text: string; city: string; region: string }[] = [];
        data.planes.forEach(p => {
            if (!p.continents) return;
            p.continents.forEach(c => {
                if (!c.regions) return;
                c.regions.forEach(r => {
                    if (!r.cities) return;
                    r.cities.forEach(city => {
                        if (city.rumor) {
                            allRumors.push({ text: city.rumor, city: city.name, region: r.name });
                        }
                    });
                });
            });
        });

        if (allRumors.length > 0) {
            return allRumors[Math.floor(Math.random() * allRumors.length)];
        }
        return null;
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-12 pb-20 animate-fade-in"
        >
            <div className="relative pt-12 text-center mb-4">
                {/* Hero Glow Backdrop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-superia/10 blur-[120px] rounded-full pointer-events-none" />
                
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1 className="font-serif text-7xl md:text-9xl font-black tracking-[0.2em] uppercase text-gold-gradient drop-shadow-2xl mb-4">
                        {data.worldName}
                    </h1>
                    <div className="flex items-center justify-center gap-6 mb-8 opacity-60">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-superia to-transparent" />
                        <p className="text-xl md:text-3xl text-text-dim italic font-serif tracking-widest uppercase">Titanens Sidste Hjerteslag</p>
                        <div className="h-px w-24 bg-gradient-to-l from-transparent via-superia to-transparent" />
                    </div>
                </motion.div>
            </div>

            <MysticCard className="max-w-5xl mx-auto border-superia/10">
                <div className="max-w-3xl mx-auto">
                    <p className="text-xl md:text-2xl leading-relaxed text-center mb-16 text-text-main/90 font-serif italic">
                        <SmartLink text={data.description} />
                    </p>

                    {/* Rumor of the Day - Premium Version */}
                    {rumor && (
                        <motion.div
                            className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-10 my-16 group shadow-glass-red"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {/* Animated Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-inferia/10 to-transparent opacity-50" />
                            
                            <div className="absolute -top-12 -right-12 opacity-5 text-white group-hover:scale-110 transition-transform duration-[2000ms]">
                                <Scroll size={200} />
                            </div>

                            <div className="relative z-10">
                                <h3 className="flex items-center gap-3 text-inferia font-serif font-black text-xl mb-6 tracking-widest uppercase animate-pulse-slow">
                                    <Sparkles size={24} /> Rygtet hviskes i skyggerne...
                                </h3>
                                <p className="italic text-xl md:text-2xl mb-8 text-text-main font-serif leading-relaxed line-clamp-4">
                                    "{rumor.text}"
                                </p>
                                <div className="flex justify-end items-center gap-3 text-sm text-text-dim uppercase tracking-widest font-bold">
                                    <span className="w-8 h-px bg-white/10" />
                                    Hørt i <strong className="text-text-main ml-1">{rumor.city}</strong> <span className="opacity-40">/</span> {rumor.region}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                        <Link to="/plane/lyssiden" className="block group no-underline h-full">
                            <div className="h-full p-10 rounded-3xl bg-white/5 border border-white/10 hover:border-superia/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-glass-gold flex flex-col justify-between">
                                <div>
                                    <h3 className="text-3xl font-serif font-black text-superia tracking-widest uppercase mb-6 group-hover:text-white transition-colors">Lys-Siden</h3>
                                    <div className="w-12 h-1 bg-superia/30 mb-6 group-hover:w-full transition-all duration-500" />
                                    <p className="text-text-dim text-lg leading-relaxed font-serif group-hover:text-text-main transition-colors">Den øvre flade af logik og orden. Hvor de oplyste byer rækker mod stjernerne og magien er kodificeret.</p>
                                </div>
                                <div className="mt-8 text-xs uppercase tracking-[0.3em] font-black text-superia/40 group-hover:text-superia transition-colors">Gå mod lyset ✦</div>
                            </div>
                        </Link>

                        <Link to="/plane/skyggesiden" className="block group no-underline h-full">
                            <div className="h-full p-10 rounded-3xl bg-white/5 border border-white/10 hover:border-inferia/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-glass-red flex flex-col justify-between">
                                <div>
                                    <h3 className="text-3xl font-serif font-black text-inferia tracking-widest uppercase mb-6 group-hover:text-white transition-colors">Skygge-Siden</h3>
                                    <div className="w-12 h-1 bg-inferia/30 mb-6 group-hover:w-full transition-all duration-500" />
                                    <p className="text-text-dim text-lg leading-relaxed font-serif group-hover:text-text-main transition-colors">Den nedre flade af instinkt og biologi. Hvor ur-skoven gror vildt under månen og blodet synger.</p>
                                </div>
                                <div className="mt-8 text-xs uppercase tracking-[0.3em] font-black text-inferia/40 group-hover:text-inferia transition-colors">Dyk i dybet ✦</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </MysticCard>
        </motion.div>
    );
};
