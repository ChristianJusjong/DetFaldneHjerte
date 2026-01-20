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
        <header className={cn("mb-12 text-center", className)}>
            {breadcrumbs && (
                <div className="flex justify-center gap-2 text-sm text-text-dim mb-4 font-serif">
                    {breadcrumbs.map((b, i) => (
                        <span key={i} className="flex items-center gap-2">
                            {i > 0 && <span className="opacity-50">/</span>}
                            <span className={i === breadcrumbs.length - 1 ? "text-superia" : "hover:text-white transition-colors cursor-pointer"}>{b.label}</span>
                        </span>
                    ))}
                </div>
            )}
            <h1 className={cn("font-serif text-5xl md:text-6xl font-bold mb-4 leading-tight text-white tracking-widest uppercase drop-shadow-lg flex flex-col items-center gap-4", titleClassName)}>
                {icon && <div className="text-superia opacity-80">{icon}</div>}
                <span className="text-gold-gradient">{title}</span>
            </h1>
            <div className="flex items-center justify-center gap-4 mb-6 opacity-70">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-superia to-transparent" />
                <div className="text-superia text-xl">❖</div>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-superia to-transparent" />
            </div>
            {subtitle && (
                <p className="text-xl text-text-dim italic font-main max-w-2xl mx-auto">
                    {subtitle}
                </p>
            )}
        </header>
    );
};
