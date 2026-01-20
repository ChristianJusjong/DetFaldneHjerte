import type { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type BadgeVariant = 'default' | 'superia' | 'inferia' | 'gold' | 'outline';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
    const variants = {
        default: "bg-surface-light border border-white/10 text-text-dim",
        superia: "bg-superia/10 border border-superia/30 text-superia",
        inferia: "bg-inferia/10 border border-inferia/30 text-inferia",
        gold: "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400",
        outline: "bg-transparent border border-white/20 text-text-dim"
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium tracking-wide font-serif",
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
};

