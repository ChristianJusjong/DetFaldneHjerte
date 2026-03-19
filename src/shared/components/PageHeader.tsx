import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    className?: string;
    titleClassName?: string;
    icon?: React.ReactNode;
    breadcrumbs?: { label: string; path: string }[];
}

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const PageHeader = ({ title, subtitle, className, titleClassName, icon, breadcrumbs }: PageHeaderProps) => {
    return (
        <header className={cn("mb-16 text-center animate-fade-in", className)}>
            {breadcrumbs && (
                <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-xs md:text-sm text-text-dim mb-6 font-serif tracking-widest uppercase">
                    {breadcrumbs.map((b, i) => (
                        <span key={i} className="flex items-center gap-4">
                            {i > 0 && <span className="opacity-30 text-superia">✦</span>}
                            <span className={clsx(
                                "transition-all duration-300",
                                i === breadcrumbs.length - 1 ? "text-superia font-bold" : "hover:text-white cursor-pointer opacity-60"
                            )}>
                                {b.label}
                            </span>
                        </span>
                    ))}
                </div>
            )}
            
            <div className="relative inline-block mb-6">
                <h1 className={cn(
                    "font-serif text-5xl md:text-7xl font-extrabold leading-tight tracking-[0.15em] uppercase drop-shadow-2xl flex flex-col items-center gap-6",
                    titleClassName
                )}>
                    {icon && <div className="text-superia animate-float drop-shadow-[0_0_15px_rgba(252,211,77,0.4)]">{icon}</div>}
                    <span className="text-gold-gradient py-2">{title}</span>
                </h1>
                
                {/* Decorative horizontal lines */}
                <div className="flex items-center justify-center gap-6 mt-2 opacity-50">
                    <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent via-superia to-transparent" />
                    <div className="text-superia text-2xl animate-pulse-slow">❖</div>
                    <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent via-superia to-transparent" />
                </div>
            </div>

            {subtitle && (
                <p className="text-xl md:text-2xl text-text-dim italic font-serif max-w-3xl mx-auto leading-relaxed opacity-80">
                    {subtitle}
                </p>
            )}
        </header>
    );
};
