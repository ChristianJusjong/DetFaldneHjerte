import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Scroll } from 'lucide-react';
import { SmartLink } from '../components/SmartLink';
import { getLore } from '../utils/data';
import { MysticCard } from '../components/ui/MysticCard';

export const HomePage = () => {
    const data = getLore();
    const [rumor, setRumor] = useState<{ text: string; city: string; region: string } | null>(null);

    // Get a random rumor on mount
    useEffect(() => {
        const allRumors: { text: string; city: string; region: string }[] = [];
        data.planes.forEach(p => p.continents.forEach(c => {
            c.regions.forEach(r => {
                r.cities.forEach(city => {
                    if (city.rumor) {
                        allRumors.push({ text: city.rumor, city: city.name, region: r.name });
                    }
                });
            });
        }));

        if (allRumors.length > 0) {
            const random = allRumors[Math.floor(Math.random() * allRumors.length)];
            setRumor(random);
        }
    }, [data.planes]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-8"
        >
            <MysticCard>
                <div className="text-center mb-12">
                    <motion.div
                        animate={{
                            textShadow: ["0 0 10px #7ccef3", "0 0 20px #e63946", "0 0 10px #7ccef3"],
                        }}
                        transition={{ duration: 5, repeat: Infinity }}
                    >
                        <h1 className="font-serif text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            {data.worldName}
                        </h1>
                    </motion.div>
                    <p className="text-2xl text-text-dim mt-4 italic font-serif">Titanens Sidste Hjerteslag</p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <p className="text-xl leading-relaxed text-center mb-12 text-gray-200">
                        <SmartLink text={data.description} />
                    </p>

                    {/* Rumor of the Day */}
                    {rumor && (
                        <motion.div
                            className="relative overflow-hidden rounded-2xl border border-inferia/30 bg-gradient-to-br from-white/5 to-inferia/10 p-8 my-12"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="absolute -top-4 -right-4 opacity-10 text-white">
                                <Scroll size={120} />
                            </div>
                            <h3 className="flex items-center gap-2 text-inferia font-bold text-lg mb-4">
                                <Sparkles size={20} /> Rygtet hviskes i skyggerne...
                            </h3>
                            <p className="italic text-lg mb-6 text-gray-300">"{rumor.text}"</p>
                            <div className="flex justify-end text-sm text-text-dim">
                                — Hørt i <strong className="text-white ml-1">{rumor.city}</strong> ({rumor.region})
                            </div>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        <motion.a
                            href="/continent/superia"
                            className="block p-8 rounded-2xl bg-superia/5 border border-superia/10 hover:bg-superia/10 hover:border-superia/30 transition-all group cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-2xl font-serif font-bold text-superia border-b border-superia/20 pb-2 mb-4 group-hover:border-superia/50 transition-colors">Superia</h3>
                            <p className="text-gray-400 group-hover:text-gray-300">Den øvre flade af logik og orden. Hvor de oplyste byer rækker mod stjernerne og magien er kodificeret.</p>
                        </motion.a>

                        <motion.a
                            href="/continent/inferia"
                            className="block p-8 rounded-2xl bg-inferia/5 border border-inferia/10 hover:bg-inferia/10 hover:border-inferia/30 transition-all group cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-2xl font-serif font-bold text-inferia border-b border-inferia/20 pb-2 mb-4 group-hover:border-inferia/50 transition-colors">Inferia</h3>
                            <p className="text-gray-400 group-hover:text-gray-300">Den nedre flade af instinkt og biologi. Hvor ur-skoven gror vildt under månen og blodet synger.</p>
                        </motion.a>
                    </div>
                </div>
            </MysticCard>
        </motion.div>
    );
};
