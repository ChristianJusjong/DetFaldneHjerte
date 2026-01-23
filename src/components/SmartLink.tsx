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
            const existing = map.get(term) || [];
            existing.push(candidate);
            map.set(term, existing);
        };

        // Planes & Continents
        data.planes.forEach(p => {
            if (p.name) addTerm(p.name, { url: `/plane/${p.id}`, type: 'plane' });

            p.continents.forEach(c => {
                if (c.name) addTerm(c.name, { url: `/continent/${c.id}`, type: 'continent', continentId: c.id });

                // Races linked to continents
                c.races.forEach(r => {
                    if (r.name) addTerm(r.name, { url: `/lore/race/${r.id || slugify(r.name)}`, type: 'race', continentId: c.id });
                });

                // Regions
                c.regions.forEach(reg => {
                    if (reg.name) addTerm(reg.name, { url: `/continent/${c.id}/${slugify(reg.name)}`, type: 'region', continentId: c.id, regionId: slugify(reg.name) });

                    // Cities
                    reg.cities.forEach(city => {
                        if (city.name) {
                            addTerm(city.name, {
                                url: `/continent/${c.id}/${slugify(reg.name)}/${slugify(city.name)}`,
                                type: 'city',
                                continentId: c.id,
                                regionId: slugify(reg.name)
                            });
                        }

                        // Also add assets from districts to SmartLink? Might be too many terms.
                        // Let's stick to high level for now.
                    });
                });
            });
        });

        // Gods
        data.religion.gods.forEach(g => {
            if (g.name) {
                const name = g.name.split(' (')[0];
                addTerm(name, { url: `/lore/god/${g.id || slugify(g.name)}`, type: 'god' });
            }
        });

        // Organizations
        data.organizations?.forEach(o => {
            if (o.name) addTerm(o.name, { url: `/lore/organization/${o.id || slugify(o.name)}`, type: 'org' });
        });

        // Bestiary
        data.bestiary?.forEach(b => {
            if (b.name) addTerm(b.name, { url: `/lore/bestiary/${b.id || slugify(b.name)}`, type: 'bestiary' });
        });

        return map;
    }, []);

    // Create a master regex for all terms
    const parts = useMemo(() => {
        const sortedTerms = Array.from(termMap.keys()).sort((a, b) => b.length - a.length);
        if (sortedTerms.length === 0) return [text];

        // Escape regex special chars
        const pattern = sortedTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');

        const split = text.split(regex);

        return split.map((part, i) => {
            const matchedKey = sortedTerms.find(t => t.toLowerCase() === part.toLowerCase());

            if (matchedKey) {
                const candidates = termMap.get(matchedKey) || [];

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
