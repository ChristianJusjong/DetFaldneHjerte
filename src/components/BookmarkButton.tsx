import { Star } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'framer-motion';

interface BookmarkButtonProps {
    url: string;
    title: string;
    type: 'continent' | 'region' | 'city' | 'other';
}

export const BookmarkButton = ({ url, title, type }: BookmarkButtonProps) => {
    const { isBookmarked, addBookmark, removeBookmark } = useGameStore();
    const active = isBookmarked(url);

    const handleClick = () => {
        if (active) {
            removeBookmark(url);
        } else {
            addBookmark({ url, title, type });
        }
    };

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); handleClick(); }}
            style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                color: active ? '#f1c40f' : 'var(--color-text-dim)',
                transition: 'color 0.2s'
            }}
            title={active ? "Fjern bogmærke" : "Tilføj bogmærke"}
        >
            <Star size={24} fill={active ? '#f1c40f' : 'none'} />
        </motion.button>
    );
};
