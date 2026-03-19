import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface LoreCardProps {
    children: ReactNode;
    accentColor?: 'superia' | 'inferia' | 'green' | 'purple' | 'blue' | 'red' | 'custom';
    customColor?: string;
    className?: string;
}

export const LoreCard = ({ children, accentColor = 'superia', customColor, className }: LoreCardProps) => {
    const accentMap = {
        superia: 'border-superia/20 group-hover:border-superia/50 group-hover:bg-superia/5 group-hover:shadow-[0_10px_30px_rgba(252,211,77,0.1)]',
        inferia: 'border-inferia/20 group-hover:border-inferia/50 group-hover:bg-inferia/5 group-hover:shadow-[0_10px_30px_rgba(239,68,68,0.1)]',
        green: 'border-green-500/20 group-hover:border-green-500/50 group-hover:bg-green-500/5 group-hover:shadow-[0_10px_30px_rgba(34,197,94,0.1)]',
        purple: 'border-purple-500/20 group-hover:border-purple-500/50 group-hover:bg-purple-500/5 group-hover:shadow-[0_10px_30px_rgba(168,85,247,0.1)]',
        blue: 'border-blue-500/20 group-hover:border-blue-500/50 group-hover:bg-blue-500/5 group-hover:shadow-[0_10px_30px_rgba(59,130,246,0.1)]',
        red: 'border-red-500/20 group-hover:border-red-500/50 group-hover:bg-red-500/5 group-hover:shadow-[0_10px_30px_rgba(239,68,68,0.1)]',
        custom: '',
    };

    const style = accentColor === 'custom' && customColor ? {
        borderColor: `${customColor}33`, // 20% opacity
        '--hover-border': `${customColor}80`, // 50% opacity
        '--hover-bg': `${customColor}0D`, // 5% opacity
        '--hover-shadow': `0 10px 30px ${customColor}1A`, // 10% opacity
    } as any : {};

    return (
        <motion.div
            whileHover={{ y: -4 }}
            style={style}
            className={clsx(
                "h-full p-6 rounded-2xl bg-black/30 backdrop-blur-md border shadow-glass transition-all duration-300 flex flex-col",
                accentColor !== 'custom' ? accentMap[accentColor] : "group-hover:border-[var(--hover-border)] group-hover:bg-[var(--hover-bg)] group-hover:shadow-[var(--hover-shadow)]",
                className
            )}
        >
            {children}
            <div className="mt-auto pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className={clsx(
                    "text-[10px] uppercase font-bold tracking-[0.2em]",
                    accentColor === 'superia' && "text-superia",
                    accentColor === 'inferia' && "text-inferia",
                    accentColor === 'green' && "text-green-500",
                    accentColor === 'purple' && "text-purple-500",
                    accentColor === 'blue' && "text-blue-500",
                    accentColor === 'red' && "text-red-500",
                )}
                style={accentColor === 'custom' ? { color: customColor } : {}}
                >
                    Læs mere &rarr;
                </span>
            </div>
        </motion.div>
    );
};
