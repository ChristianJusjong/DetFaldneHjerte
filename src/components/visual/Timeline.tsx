import { useRef } from 'react';
import history from '../../data/modules/history.json';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const Timeline = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const amount = direction === 'left' ? -300 : 300;
            scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative w-full h-full min-h-[60vh] flex flex-col justify-center">
            {/* Controls */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20">
                <button onClick={() => scroll('left')} className="p-3 bg-black/50 hover:bg-superia/20 rounded-full text-white border border-white/10 backdrop-blur-sm transition-all">
                    <ArrowLeft />
                </button>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20">
                <button onClick={() => scroll('right')} className="p-3 bg-black/50 hover:bg-superia/20 rounded-full text-white border border-white/10 backdrop-blur-sm transition-all">
                    <ArrowRight />
                </button>
            </div>

            {/* Timeline Track */}
            <div
                ref={scrollRef}
                className="flex items-center gap-0 overflow-x-auto no-scrollbar snap-x snap-mandatory px-20 py-10"
            >
                {/* Line */}
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-white/10 z-0" />

                {history.eras.map((era) => (
                    <div key={era.id} className="flex items-center shrink-0 relative">
                        {/* Era Label */}
                        <div className="absolute -top-16 left-4 text-xs font-serif uppercase tracking-widest px-2 py-1 rounded bg-black/40 border border-white/10" style={{ color: era.color }}>
                            {era.name}
                        </div>

                        {era.events.map((ev, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`relative w-64 snap-center shrink-0 px-4 group`}
                            >
                                {/* Connector */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#1e1e1e] border-2 z-10 transition-all group-hover:scale-125 group-hover:shadow-[0_0_15px_currentColor]" style={{ borderColor: era.color, backgroundColor: ev.major ? era.color : '#1e1e1e' }} />

                                {/* Content Card (Alternating Top/Bottom) */}
                                <div className={`flex flex-col items-center text-center ${idx % 2 === 0 ? '-mt-40' : 'mt-12'}`}>
                                    <div className="text-2xl font-bold font-serif text-white/20 group-hover:text-white transition-colors">{ev.year}</div>
                                    <div className="mt-2 p-4 bg-surface/80 border border-white/10 rounded-lg backdrop-blur-sm w-full transition-all group-hover:border-superia/30 group-hover:bg-surface">
                                        <h4 className="text-superia font-serif font-bold">{ev.title}</h4>
                                        <p className="text-xs text-white/70 mt-1 leading-relaxed">{ev.description}</p>
                                    </div>
                                    {/* Line to connector */}
                                    <div className={`absolute left-1/2 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent ${idx % 2 === 0 ? 'top-[90px] h-10' : '-top-4 h-10'}`} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ))}

                {/* End Buffer */}
                <div className="w-48 shrink-0" />
            </div>
        </div>
    );
};
