import React, { useState } from 'react';
import { Maximize2, Map as MapIcon, Mountain, Swords } from 'lucide-react';
import { ImageWithFallback } from '../ImageWithFallback';

interface MapVisualizerProps {
    mapImage: string;
    scenicImage?: string;
    battlemapImage?: string;
    title: string;
    className?: string;
}

export const MapVisualizer: React.FC<MapVisualizerProps> = ({
    mapImage,
    scenicImage,
    battlemapImage,
    title,
    className = ""
}) => {
    // Default priority: Scenic -> Map -> Battlemap
    const [viewMode, setViewMode] = useState<'scenic' | 'map' | 'battle'>(
        scenicImage ? 'scenic' : 'map'
    );
    const [isExpanded, setIsExpanded] = useState(false);

    const currentImage = viewMode === 'scenic' ? scenicImage :
        viewMode === 'battle' ? battlemapImage : mapImage;

    return (
        <div className={`relative group ${className}`}>
            <div className={`relative overflow-hidden rounded-3xl border border-white/10 shadow-premium transition-all duration-500 ${isExpanded ? 'fixed inset-4 z-50 bg-black/90' : 'aspect-video w-full'}`}>

                {/* Main Image */}
                <div className="absolute inset-0 bg-black/40">
                    <ImageWithFallback
                        src={currentImage || ''}
                        alt={`${title} - ${viewMode}`}
                        className="w-full h-full object-cover transition-opacity duration-500"
                        fallbackText={title}
                    />
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Controls */}
                <div className="absolute top-4 right-4 flex gap-2">
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
                <div className="absolute bottom-0 left-0 p-6 pointer-events-none">
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
