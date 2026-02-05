import { useMemo, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { buildLoreGraph } from '../../utils/graphBuilder';
import { useNavigate } from 'react-router-dom';
import { Maximize, Minimize } from 'lucide-react';

export const LoreGraph = () => {
    const navigate = useNavigate();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const graphRef = useRef<any>(null);

    // Memoize data so it doesn't rebuild on every render
    const graphData = useMemo(() => buildLoreGraph(), []);

    const handleNodeClick = (node: any) => {
        // Zoom to node
        graphRef.current?.centerAt(node.x, node.y, 1000);
        graphRef.current?.zoom(3, 2000);

        // Simple navigation logic based on ID prefix
        setTimeout(() => {
            if (node.group === 'plane') navigate(`/planes/${node.id}`);
            else if (node.group === 'city') navigate(`/cities/${node.name}`);
            else if (node.group === 'continent') navigate(`/continents/${node.name}`);
        }, 1200);
    };

    return (
        <div className={`relative transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-50 bg-bg' : 'h-[600px] w-full rounded-xl overflow-hidden border border-white/10 shadow-premium'}`}>
            <div className="absolute top-4 right-4 z-40 flex gap-2">
                <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white/80 hover:text-white border border-white/10"
                >
                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
            </div>

            <div className="absolute top-4 left-4 z-40 bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10 pointer-events-none">
                <h3 className="font-serif text-xl text-superia mb-1">Vidensnettet</h3>
                <p className="text-xs text-white/60">Udforsk forbindelserne i Det Faldne Hjerte</p>
                <div className="mt-2 text-xs space-y-1">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#a855f7]" /> Planer</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Kontinenter</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#10b981]" /> Byer</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#eab308]" /> Guder</div>
                </div>
            </div>

            <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
                nodeLabel="name"
                nodeColor="color"
                nodeRelSize={6}
                linkColor={() => 'rgba(255,255,255,0.2)'}
                backgroundColor="#0a0a0a"
                onNodeClick={handleNodeClick}
                cooldownTicks={100}
                onEngineStop={() => graphRef.current?.zoomToFit(400)}
            />
        </div>
    );
};
