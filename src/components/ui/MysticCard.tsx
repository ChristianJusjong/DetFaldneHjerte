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
                "relative bg-surface/95 backdrop-blur-sm",
                // Border - Double Line / Stone feel
                "border-2 border-border shadow-2xl",
                // Rounded corners - slightly less rounded than GlassCard
                "rounded-xl",
                // Padding
                !noPadding && "p-8 md:p-12",
                // Texture overlay via pseudo-element (optional, handled by bg-surface mostly)
                className
            )}
        >
            {/* Corner Ornaments (CSS pseudo-elements could handle this, but simplified here) */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-superia/30 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-superia/30 rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-superia/30 rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-superia/30 rounded-br-lg pointer-events-none" />

            {children}
        </div>
    );
};
