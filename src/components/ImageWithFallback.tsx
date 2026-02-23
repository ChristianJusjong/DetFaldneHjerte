import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
    fallbackText?: string;
}

export const ImageWithFallback = ({
    src,
    alt,
    fallbackSrc,
    fallbackText = 'Billede Mangler',
    className,
    ...props
}: ImageWithFallbackProps) => {
    const [error, setError] = useState(false);

    if (error || !src) {
        if (fallbackSrc) {
            return <img src={fallbackSrc} alt={alt} className={className} {...props} />;
        }
        return (
            <div
                className={`relative overflow-hidden flex flex-col items-center justify-center bg-surface border border-border/50 text-text-dim rounded-md shadow-inset ${className}`}
                style={{ minHeight: '200px' }}
            >
                {/* Texture Overlay */}
                <div className="absolute inset-0 bg-parchment opacity-10 pointer-events-none mix-blend-overlay" />

                {/* Icon & Text */}
                <div className="relative z-10 flex flex-col items-center gap-3 p-6 text-center">
                    <div className="p-3 rounded-full bg-superia/5 border border-superia/20 shadow-[0_0_15px_rgba(212,175,55,0.05)]">
                        <ImageOff size={32} className="text-superia/60" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="font-serif text-sm tracking-widest uppercase text-superia/80">{fallbackText}</span>
                        {alt && <span className="text-xs opacity-50 font-main max-w-[200px] truncate">{alt}</span>}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
            {...props}
        />
    );
};
