import { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { MapPin, X, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

// Mock Data for Pins - in a real app this would come from the lore data
// Normalized coordinates (0-100%)
const INITIAL_PINS = [
    { id: '1', x: 45, y: 35, label: 'Aethelgard', type: 'city', link: '/city/Aethelgard' },
    { id: '2', x: 65, y: 45, label: 'Klangdalene', type: 'region', link: '/region/Klangdalene' },
    { id: '3', x: 25, y: 60, label: 'Sølvtungenæsset', type: 'region', link: '/region/Sølvtungenæsset' },
    { id: '4', x: 55, y: 75, label: 'Bittersumpen', type: 'district', link: '/region/Bittersumpen' },
    { id: '5', x: 80, y: 20, label: 'Isødet', type: 'region', link: '/region/Isødet' }
];

export const InteractiveMap = () => {
    const [selectedPin, setSelectedPin] = useState<string | null>(null);

    // Use a default map if specific ones usually exist in /assets/maps/continents/
    // For now we default to a placeholder or the most likely distinct map
    const mapUrl = "/assets/maps/klangdalene.png";

    return (
        <div className="fixed inset-0 z-50 bg-bg overflow-hidden flex flex-col">
            {/* Header / Controls Overlay */}
            <div className="absolute top-0 left-0 right-0 p-4 z-50 flex justify-between items-start pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 pointer-events-auto">
                    <h1 className="text-2xl font-serif font-bold text-superia mb-1">Verdenskortet</h1>
                    <p className="text-sm text-text-dim">Superia & Omgivelser</p>
                </div>

                <Link to="/" className="pointer-events-auto bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/10 hover:bg-white/10 hover:text-white transition-colors">
                    <X size={24} className="text-text-dim" />
                </Link>
            </div>

            {/* Map Area */}
            <div className="flex-1 w-full h-full bg-[#0a0a0a]">
                <TransformWrapper
                    initialScale={1}
                    initialPositionX={0}
                    initialPositionY={0}
                    minScale={0.5}
                    maxScale={4}
                    centerOnInit
                    limitToBounds={false}
                >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                        <>
                            {/* Tools */}
                            <div className="absolute bottom-8 right-8 z-50 flex flex-col gap-2 pointer-events-auto">
                                <button onClick={() => zoomIn()} className="p-3 bg-black/80 border border-white/10 rounded-full hover:bg-white/10 hover:text-superia transition-colors"><ZoomIn size={20} /></button>
                                <button onClick={() => zoomOut()} className="p-3 bg-black/80 border border-white/10 rounded-full hover:bg-white/10 hover:text-superia transition-colors"><ZoomOut size={20} /></button>
                                <button onClick={() => resetTransform()} className="p-3 bg-black/80 border border-white/10 rounded-full hover:bg-white/10 hover:text-superia transition-colors"><Maximize size={20} /></button>
                            </div>

                            <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
                                <div className="relative w-[1920px] h-[1080px] bg-black"> {/* Fixed size container for consistent relative positioning */}
                                    <img
                                        src={mapUrl}
                                        alt="World Map"
                                        className="w-full h-full object-contain opacity-90"
                                        onError={(e) => {
                                            // Fallback if image missing
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement!.style.backgroundColor = '#1a1a1a';
                                            e.currentTarget.parentElement!.innerHTML += '<div class="absolute inset-0 flex items-center justify-center text-text-dim flex-col gap-4"><span class="font-serif text-xl">Kort ikke fundet</span></div>';
                                        }}
                                    />

                                    {/* Pins */}
                                    {INITIAL_PINS.map(pin => (
                                        <button
                                            key={pin.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedPin(selectedPin === pin.id ? null : pin.id);
                                            }}
                                            className={clsx(
                                                "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group",
                                                selectedPin === pin.id ? "z-40 scale-125" : "z-30 hover:scale-110"
                                            )}
                                            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                                        >
                                            <div className={clsx(
                                                "relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 transition-colors",
                                                selectedPin === pin.id
                                                    ? "bg-superia border-white text-black"
                                                    : "bg-black/80 border-superia text-superia group-hover:bg-superia group-hover:text-black"
                                            )}>
                                                <MapPin size={16} fill={selectedPin === pin.id ? "currentColor" : "none"} />

                                                {/* Ripple Effect for active pin */}
                                                {selectedPin === pin.id && (
                                                    <span className="absolute inset-0 rounded-full bg-superia/50 animate-ping" />
                                                )}
                                            </div>

                                            {/* Label (Always visible on hover or selected) */}
                                            <div className={clsx(
                                                "absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-black/80 backdrop-blur border border-white/10 rounded text-xs font-serif whitespace-nowrap transition-opacity pointer-events-none",
                                                selectedPin === pin.id || "opacity-0 group-hover:opacity-100"
                                            )}>
                                                {pin.label}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </TransformComponent>
                        </>
                    )}
                </TransformWrapper>
            </div>

            {/* Selected Pin Details Panel (Bottom Left or Side) */}
            <AnimatePresence>
                {selectedPin && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="absolute bottom-8 left-8 z-50 w-80"
                    >
                        {INITIAL_PINS.filter(p => p.id === selectedPin).map(pin => (
                            <div key={pin.id} className="bg-surface/90 backdrop-blur-md border border-superia/30 p-6 rounded-xl shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-superia to-transparent opacity-50" />

                                <h3 className="text-xl font-serif font-bold text-superia mb-1">{pin.label}</h3>
                                <div className="text-xs text-superia/60 uppercase tracking-widest mb-4">{pin.type}</div>

                                <p className="text-sm text-text-dim mb-6 leading-relaxed">
                                    Klik nedenfor for at besøge dette sted i arkiverne og læse mere om dets historie og befolkning.
                                </p>

                                <div className="flex gap-3">
                                    <Link
                                        to={pin.link}
                                        className="flex-1 py-2 bg-superia/10 hover:bg-superia/20 border border-superia/30 rounded text-center text-sm font-bold text-superia transition-colors"
                                    >
                                        Besøg Sted
                                    </Link>
                                    <button
                                        onClick={() => setSelectedPin(null)}
                                        className="px-4 py-2 hover:bg-white/5 border border-transparent hover:border-white/10 rounded text-text-dim transition-colors"
                                    >
                                        Luk
                                    </button>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
