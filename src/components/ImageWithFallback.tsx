import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
    fallbackText?: string;
}

export const ImageWithFallback = ({
    src,
    alt,
    fallbackSrc = 'https://placehold.co/600x400/1a1a24/FFF?text=Billede+Mangler',
    fallbackText,
    className,
    ...props
}: ImageWithFallbackProps) => {
    const [error, setError] = useState(false);

    if (error) {
        if (fallbackText) {
            return (
                <div className={`image-fallback-container ${className}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a24', color: '#fff', flexDirection: 'column', gap: '1rem', minHeight: '200px', borderRadius: '12px' }}>
                    <ImageOff size={48} style={{ opacity: 0.5 }} />
                    <span style={{ opacity: 0.7 }}>{fallbackText}</span>
                </div>
            );
        }
        return <img src={fallbackSrc} alt={alt} className={className} {...props} />;
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
