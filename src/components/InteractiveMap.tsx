import { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MysticCard } from './ui/MysticCard';
import { getLore } from '../utils/data';
import mapImage from '../assets/map.png';

export const InteractiveMap = () => {
    const navigate = useNavigate();
    const data = getLore();
    const [activePin, setActivePin] = useState<any>(null);

    // Hardcoded pin locations for demonstration purposes
    // In a real app, these coordinates would be part of the data model
    const PIN_LOCATIONS: Record<string, { x: number, y: number }> = {
        'Aerthos': { x: 45, y: 35 },
        'Prythian': { x: 65, y: 55 },
        'Aethelgard': { x: 25, y: 60 },
        // Add more default pins or derive from data if they had coords
    };

    // Flatten cities for pins
    const pins = data.planes.flatMap(p =>
        p.continents.flatMap(c =>
            c.regions.flatMap(r =>
                r.cities.map(city => ({
                    type: 'city',
                    name: city.name,
                    region: r.name,
                    desc: city.desc,
                    // Random positions for demo since we don't have real coords
                    x: PIN_LOCATIONS[city.name]?.x || Math.random() * 80 + 10,
                    y: PIN_LOCATIONS[city.name]?.y || Math.random() * 60 + 20
                }))
            )
        )
    );

    return (
        <div className="w-full h-full min-h-[600px] bg-black/40 rounded-xl overflow-hidden border border-white/10 relative">
            <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={4}
                centerOnInit
            >
                {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                        <div className="absolute top-4 right-4 z-40 flex flex-col gap-2">
                            <button onClick={() => zoomIn()} className="p-2 bg-black/60 text-white rounded hover:bg-superia hover:text-black transition-colors">+</button>
                            <button onClick={() => zoomOut()} className="p-2 bg-black/60 text-white rounded hover:bg-superia hover:text-black transition-colors">-</button>
                            <button onClick={() => resetTransform()} className="p-2 bg-black/60 text-white rounded hover:bg-superia hover:text-black transition-colors">Rx</button>
                        </div>

                        <TransformComponent wrapperClass="w-full h-full" contentClass="w-full h-full">
                            <div className="relative w-[1200px] h-[800px]"> {/* Fixed size container for consistent pin placement */}
                                <img
                                    src={mapImage}
                                    alt="World Map"
                                    className="w-full h-full object-cover opacity-80"
                                />
                                {pins.map((pin, i) => (
                                    <div
                                        key={i}
                                        className="absolute cursor-pointer group"
                                        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                                        onClick={() => setActivePin(pin)}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.2, y: -5 }}
                                            className="relative"
                                        >
                                            <MapPin
                                                size={24}
                                                className="text-superia drop-shadow-[0_0_5px_rgba(255,215,0,0.5)] fill-black/50"
                                            />
                                        </motion.div>
                                    </div>
                                ))}
                            </div>
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>

            <AnimatePresence>
                {activePin && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 pointer-events-none"
                    >
                        <MysticCard className="pointer-events-auto shadow-2xl border-superia/30">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-bold font-serif text-white m-0">{activePin.name}</h3>
                                    <span className="text-xs text-superia uppercase tracking-widest">{activePin.region}</span>
                                </div>
                                <button onClick={() => setActivePin(null)} className="text-text-dim hover:text-white"><MapPin size={16} /></button>
                            </div>
                            <p className="text-sm text-text-dim line-clamp-2 mb-4">{activePin.desc}</p>
                            <button
                                onClick={() => navigate(`/city/${activePin.name}`)}
                                className="w-full py-2 bg-white/10 hover:bg-superia/20 text-superia rounded transition-colors text-sm font-bold uppercase tracking-wide"
                            >
                                Besøg
                            </button>
                        </MysticCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
