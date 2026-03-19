import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getSmartTokens, getTermData } from '@/features/lore/utils/smartTextEngine';

interface SmartLinkProps {
    text: string;
    context?: {
        continentId?: string;
        regionId?: string;
    };
}



export const SmartLink = ({ text, context }: SmartLinkProps) => {
    const parts = useMemo(() => {
        if (!text) return null;

        const tokens = getSmartTokens(text);

        return tokens.map((part, i) => {
            // Check if this part is a term
            const candidates = getTermData(part);

            if (candidates) {
                // Context Resolution Strategy
                let bestMatch = candidates[0];
                if (context && candidates.length > 1) {
                    const regionMatch = candidates.find(c => c.regionId && c.regionId === context.regionId);
                    if (regionMatch) {
                        bestMatch = regionMatch;
                    } else {
                        const continentMatch = candidates.find(c => c.continentId && c.continentId === context.continentId);
                        if (continentMatch) {
                            bestMatch = continentMatch;
                        }
                    }
                }

                if (bestMatch) {
                    let color = 'var(--color-accent-inferia)'; // default
                    if (bestMatch.type === 'plane') color = '#ffffff';
                    if (bestMatch.type === 'continent') color = '#f1c40f';
                    if (bestMatch.type === 'god') color = 'var(--color-accent-superia)';
                    if (bestMatch.type === 'region' || bestMatch.type === 'city') color = '#2ecc71';
                    if (bestMatch.type === 'race') color = '#e67e22';

                    return (
                        <Link
                            key={`${bestMatch.url}-${i}`}
                            to={bestMatch.url}
                            style={{ color: color, fontWeight: 500, textDecoration: 'none', borderBottom: `1px dotted ${color}` }}
                            title={`${bestMatch.type} (${part})`}
                        >
                            {part}
                        </Link>
                    );
                }
            }
            return part;
        });
    }, [text, context]);

    if (!text) return null;

    return <>{parts}</>;
};
