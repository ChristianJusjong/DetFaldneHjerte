
import { Brain, Eye, Ear, MessageSquare, FlaskConical, TreeDeciduous, Sparkles, Book } from 'lucide-react';

export const slugify = (text: string) => text.toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'oe')
    .replace(/å/g, 'aa')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

export const getIconForContinent = (id: string) => {
    switch (id) {
        case 'tanketinderne': return <Brain size={18} />;
        case 'spejlsoeen': return <Eye size={18} />;
        case 'klangdalene': return <Ear size={18} />;
        case 'solvtungenaesset': return <MessageSquare size={18} />;
        case 'urskoven': return <TreeDeciduous size={18} />;
        case 'tvillingeoerne': return <Sparkles size={18} />;
        case 'slamsumpen': return <FlaskConical size={18} />;
        default: return <Book size={18} />;
    }
};
