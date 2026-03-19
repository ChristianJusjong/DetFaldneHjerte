import type { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface MysticCardProps {
    children: ReactNode;
    className?: string;
    noPadding?: boolean;
}

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const MysticCard = ({ children, className, noPadding = false }: MysticCardProps) => {
    return (
        <div
            className={cn(
                // Base
                "relative bg-surface/50 backdrop-blur-2xl text-text-main font-main",
                // Border 
                "border border-white/10 shadow-glass-gold",
                // Rounded corners
                "rounded-3xl overflow-hidden",
                // Padding
                !noPadding && "p-8 md:p-12",
                "transition-all duration-500",
                className
            )}
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            {/* Corner Ornaments - Refined */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-superia/30 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-superia/30 rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-superia/30 rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-superia/30 rounded-br-lg pointer-events-none" />
            
            {/* Animated Glow Spot */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-superia/5 blur-[80px] rounded-full pointer-events-none animate-pulse-slow" />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};
