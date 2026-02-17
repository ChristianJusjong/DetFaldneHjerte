import { useRef, useEffect, useState } from 'react';
import { Eraser, RotateCcw } from 'lucide-react';

export const BattleMap = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushSize, setBrushSize] = useState(50);
    // Default placeholder map (e.g., a dungeon or wilderness)
    const [mapUrl] = useState('https://images.unsplash.com/photo-1626084798734-75480ba08785?q=80&w=1000&auto=format&fit=crop');

    const initFog = () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        // Match container size
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fill with black fog
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Optional: Add some texture/grid to the fog? 
        // For now plain black is standard "Fog of War"
    };

    useEffect(() => {
        initFog();
        window.addEventListener('resize', initFog);
        return () => window.removeEventListener('resize', initFog);
    }, []);

    const handleMouseDown = () => setIsDrawing(true);
    const handleMouseUp = () => setIsDrawing(false);
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // "Erase" the fog
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over'; // Reset
    };

    return (
        <div className="flex flex-col h-full bg-superia/5 rounded-lg p-4 border border-white/10">
            {/* Toolbar */}
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <Eraser size={18} className="text-superia" />
                    <input
                        type="range"
                        min="10"
                        max="150"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-32 accent-superia cursor-pointer"
                        title="Brush Size"
                    />
                </div>
                <button
                    onClick={initFog}
                    className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors text-sm"
                >
                    <RotateCcw size={16} /> Reset Fog
                </button>
            </div>

            {/* Map Container */}
            <div
                ref={containerRef}
                className="relative flex-1 rounded-lg overflow-hidden border border-white/20 shadow-inner bg-black"
                style={{ cursor: 'crosshair' }}
            >
                {/* Background Map Image */}
                <img
                    src={mapUrl}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none grayscale-[0.2]"
                    alt="Battle Map"
                />

                {/* Fog Layer */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 opacity-95 hover:opacity-90 transition-opacity duration-300"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseUp}
                />
            </div>

            <p className="text-xs text-white/40 mt-2 text-center font-serif italic">
                Drag to reveal the map. Players only see what you reveal.
            </p>
        </div>
    );
};
