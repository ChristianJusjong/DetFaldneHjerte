import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getLore } from '../utils/data';
import { slugify } from '../utils/helpers';

interface SmartLinkProps {
    text: string;
    context?: {
        continentId?: string;
        regionId?: string;
    };
}

interface TermCandidate {
    url: string;
    type: string;
    continentId?: string;
    regionId?: string;
}

export const SmartLink = ({ text, context }: SmartLinkProps) => {
    if (!text) return null;

    // Memoize the terms dictionary so it's only built once
    const termMap = useMemo(() => {
        const data = getLore();
        const map = new Map<string, TermCandidate[]>();

        const addTerm = (term: string, candidate: TermCandidate) => {
            if (!term) return;
            // Clean term? strictly, we use it as is for matching
            const existing = map.get(term) || [];
            existing.push(candidate);
            map.set(term, existing);
        };

        // Planes & Continents
        data.planes.forEach(p => {
            addTerm(p.name, { url: `/plane/${p.id}`, type: 'plane' });

            p.continents.forEach(c => {
                addTerm(c.name, { url: `/continent/${c.id}`, type: 'continent', continentId: c.id });

                // Races
                c.races.forEach(r => {
                    addTerm(r.name, { url: `/races#${slugify(r.name)}`, type: 'race', continentId: c.id });
                });

                // Regions
                c.regions.forEach(reg => {
                    addTerm(reg.name, { url: `/continent/${c.id}/${slugify(reg.name)}`, type: 'region', continentId: c.id, regionId: slugify(reg.name) });

                    // Cities
                    reg.cities.forEach(city => {
                        addTerm(city.name, {
                            url: `/continent/${c.id}/${slugify(reg.name)}/${slugify(city.name)}`,
                            type: 'city',
                            continentId: c.id,
                            regionId: slugify(reg.name)
                        });
                    });
                });
            });
        });

        // Gods
        data.religion.gods.forEach(g => {
            const name = g.name.split(' (')[0];
            addTerm(name, { url: `/religion#${slugify(g.name)}`, type: 'god' });
        });

        // Organizations
        data.organizations?.forEach(o => {
            addTerm(o.name, { url: `/organizations#${slugify(o.name)}`, type: 'org' });
        });

        return map;
    }, []);

    // Create a master regex for all terms
    const parts = useMemo(() => {
        const sortedTerms = Array.from(termMap.keys()).sort((a, b) => b.length - a.length);
        if (sortedTerms.length === 0) return [text];

        // Create a single regex pattern: \b(Term1|Term2|Term3)\b
        // We escape special chars (like parens in names)
        const pattern = sortedTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        // Use word boundaries to prevent partial matches like "Ly" inside "Lys-Siden"
        // Note: Special handling might be needed for terms with special chars at boundaries, but standard \b works for most names.
        // However, some fantasy names might have hyphens or other symbols. \b matches between word \w and non-word \W.
        // If a name ends in a vowel and the text continues with a hyphen, \b might match or not depending on context.
        // For "Lys-Siden", "Ly" matches part of "Lys". "s" is a word char, so \bLy\b would NOT match "Lys".
        const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');

        const split = text.split(regex);

        return split.map((part, i) => {
            // Check if this part matches any term (case insensitive)
            // We need to find the exact key that matched (since we use 'gi', the casing in 'part' might differ from key)
            const matchedKey = sortedTerms.find(t => t.toLowerCase() === part.toLowerCase());

            if (matchedKey) {
                const candidates = termMap.get(matchedKey) || [];

                // Context Resolution Strategy:
                // 1. Exact match on RegionID (most specific)
                // 2. Exact match on ContinentID
                // 3. First available

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

                    return (
                        <Link
                            key={`${matchedKey}-${i}`}
                            to={bestMatch.url}
                            style={{ color: color, fontWeight: 500, textDecoration: 'none', borderBottom: `1px dotted ${color}` }}
                            title={`${bestMatch.type} (${matchedKey})`}
                        >
                            {part}
                        </Link>
                    );
                }
            }
            return part;
        });
    }, [text, termMap, context]);

    return <>{parts}</>;
};
