import React, { useState } from 'react';
import { Maximize2, Map as MapIcon, Mountain, Swords, MapPin as PinIcon } from 'lucide-react';
import { ImageWithFallback } from '../ImageWithFallback';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export interface MapPin {
    id: string;
    x: number; // 0-100
    y: number; // 0-100
    label: string;
    type: 'region' | 'city' | 'poi';
    link?: string;
}

interface MapVisualizerProps {
    mapImage: string;
    scenicImage?: string;
    battlemapImage?: string;
    title: string;
    className?: string;
    pins?: MapPin[];
}

export const MapVisualizer: React.FC<MapVisualizerProps> = ({
    mapImage,
    scenicImage,
    battlemapImage,
    title,
    className = "",
    pins = []
}) => {
    // Default priority: Scenic -> Map -> Battlemap
    const [viewMode, setViewMode] = useState<'scenic' | 'map' | 'battle'>(
        scenicImage ? 'scenic' : 'map'
    );
    const [isExpanded, setIsExpanded] = useState(false);
    const [hoveredPin, setHoveredPin] = useState<string | null>(null);

    const currentImage = viewMode === 'scenic' ? scenicImage :
        viewMode === 'battle' ? battlemapImage : mapImage;

    // Only show pins in Map View unless forced
    const showPins = viewMode === 'map' && pins.length > 0;

    return (
        <div className={`relative group ${className}`}>
            <div className={`relative overflow-hidden rounded-3xl border border-white/10 shadow-premium transition-all duration-500 bg-black/40 ${isExpanded ? 'fixed inset-4 z-50 bg-black/95' : 'aspect-video w-full'}`}>

                {/* Main Image Container */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <ImageWithFallback
                        src={currentImage || ''}
                        alt={`${title} - ${viewMode}`}
                        className={`w-full h-full object-cover transition-opacity duration-500 key-${viewMode}`}
                        fallbackText={title}
                    />

                    {/* Pins Layer */}
                    {showPins && (
                        <div className="absolute inset-0 z-20">
                            {pins.map((pin) => (
                                <div
                                    key={pin.id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30"
                                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                                    onMouseEnter={() => setHoveredPin(pin.id)}
                                    onMouseLeave={() => setHoveredPin(null)}
                                >
                                    {pin.link ? (
                                        <Link to={pin.link} onClick={(e) => e.stopPropagation()}>
                                            <PinMarker pin={pin} hovered={hoveredPin === pin.id} />
                                        </Link>
                                    ) : (
                                        <PinMarker pin={pin} hovered={hoveredPin === pin.id} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Controls */}
                <div className="absolute top-4 right-4 flex gap-2 z-40">
                    {/* Scenic Toggle */}
                    {scenicImage && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setViewMode('scenic'); }}
                            className={`p-2 backdrop-blur-md rounded-full transition-colors border border-white/10 ${viewMode === 'scenic' ? 'bg-accent-500 text-white' : 'bg-black/50 text-white/70 hover:bg-white/20'}`}
                            title="Vis Landskab"
                        >
                            <Mountain size={20} />
                        </button>
                    )}

                    {/* Map Toggle */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setViewMode('map'); }}
                        className={`p-2 backdrop-blur-md rounded-full transition-colors border border-white/10 ${viewMode === 'map' ? 'bg-accent-500 text-white' : 'bg-black/50 text-white/70 hover:bg-white/20'}`}
                        title="Vis Kort"
                    >
                        <MapIcon size={20} />
                    </button>

                    {/* Battlemap Toggle */}
                    {battlemapImage && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setViewMode('battle'); }}
                            className={`p-2 backdrop-blur-md rounded-full transition-colors border border-white/10 ${viewMode === 'battle' ? 'bg-red-600/80 text-white' : 'bg-black/50 text-white/70 hover:bg-white/20'}`}
                            title="Vis Slagmark (Encounter)"
                        >
                            <Swords size={20} />
                        </button>
                    )}

                    <div className="w-px h-8 bg-white/20 mx-1 self-center" />

                    <button
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        className="p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors text-white border border-white/10"
                        title={isExpanded ? "Minimer" : "Maksimer"}
                    >
                        <Maximize2 size={20} />
                    </button>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 p-6 pointer-events-none z-40">
                    <h3 className="text-2xl font-serif font-bold text-white drop-shadow-md">{title}</h3>
                    <p className="text-white/70 text-sm hidden sm:block">
                        {viewMode === 'scenic' && 'Landskabsvisning'}
                        {viewMode === 'map' && 'Taktisk Kort'}
                        {viewMode === 'battle' && 'Encounter Map'}
                    </p>
                </div>
            </div>

            {/* Backdrop for expanded mode */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                    onClick={() => setIsExpanded(false)}
                />
            )}
        </div>
    );
};

const PinMarker = ({ pin, hovered }: { pin: MapPin, hovered: boolean }) => {
    return (
        <div className="relative group">
            <motion.div
                className={`
                    p-2 rounded-full shadow-lg border-2 transition-colors relative z-10
                    ${pin.type === 'city' ? 'bg-superia border-white text-black' : 'bg-inferia border-white text-white'}
                    ${hovered ? 'scale-125' : 'scale-100'}
                `}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
            >
                <PinIcon size={16} fill="currentColor" />
            </motion.div>

            {/* Pulse Effect */}
            <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${pin.type === 'city' ? 'bg-superia' : 'bg-inferia'}`} />

            {/* Tooltip */}
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-xs font-bold rounded whitespace-nowrap border border-white/20 pointer-events-none z-50 backdrop-blur-md"
                    >
                        {pin.label}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
