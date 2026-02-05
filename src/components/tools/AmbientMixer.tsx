import { useGameStore } from '../../store/useGameStore';
import { Volume2, Music, CloudRain, Wind, Sparkles, Mic2 } from 'lucide-react';

export const AmbientMixer = () => {
    const { mixerChannels, setChannelVolume, toggleChannelMute } = useGameStore();

    const getIcon = (id: string) => {
        switch (id) {
            case 'music': return <Music size={18} />;
            case 'ambience': return <Wind size={18} />;
            case 'weather': return <CloudRain size={18} />;
            case 'fx': return <Sparkles size={18} />;
            default: return <Volume2 size={18} />;
        }
    };

    return (
        <div className="h-full flex flex-col p-6">
            <h3 className="text-superia font-serif font-bold text-2xl mb-6 flex items-center gap-3">
                <Mic2 className="text-superia" /> Lydmixer
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mixerChannels.map(channel => (
                    <div key={channel.id} className="bg-black/20 border border-white/5 rounded-xl p-4 flex flex-col items-center gap-4 relative group hover:border-superia/30 transition-colors">

                        {/* Status Light */}
                        <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${channel.muted ? 'bg-red-500/50' : 'bg-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.5)]'}`} />

                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-text-dim group-hover:text-white transition-colors">
                            {getIcon(channel.id)}
                        </div>

                        <div className="text-center">
                            <h4 className="font-bold text-white text-sm">{channel.name}</h4>
                            <div className="text-xs text-text-dim uppercase tracking-wider">{Math.round(channel.volume * 100)}%</div>
                        </div>

                        {/* Slider */}
                        <div className="w-full h-32 flex items-center justify-center py-4">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={channel.volume}
                                onChange={(e) => setChannelVolume(channel.id, parseFloat(e.target.value))}
                                className="-rotate-90 w-24 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-superia hover:accent-superia-light"
                                disabled={channel.muted}
                            />
                        </div>

                        {/* Mute Button */}
                        <button
                            onClick={() => toggleChannelMute(channel.id)}
                            className={`
                                w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all
                                ${channel.muted
                                    ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
                                    : 'bg-white/5 border-white/10 text-text-dim hover:text-white hover:bg-white/10'}
                            `}
                        >
                            {channel.muted ? 'Muted' : 'Active'}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-auto pt-8 text-center">
                <p className="text-xs text-text-dim italic">
                    Drop dine lydfiler i <code>/public/assets/audio/</code> med navnene <code>music.mp3</code>, <code>ambience.mp3</code>, etc.
                </p>
            </div>
        </div>
    );
};
