import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getLore } from '../utils/data';
import { slugify } from '../utils/helpers';

export const SmartLink = ({ text }: { text: string }) => {
    if (!text) return null;

    // Memoize the terms dictionary so it's only built once
    const terms = useMemo(() => {
        const data = getLore();
        const t: { term: string; url: string; type: string }[] = [];

        // Continents
        data.planes.forEach(p => p.continents.forEach(c => {
            t.push({ term: c.name, url: `/continent/${c.id}`, type: 'continent' });
            // Races
            c.races.forEach(r => {
                t.push({ term: r.name, url: `/races#${slugify(r.name)}`, type: 'race' });
            });
        }));

        // Gods
        data.religion.gods.forEach(g => {
            // "Pelor (The Shining One)" -> "Pelor"
            t.push({ term: g.name.split(' (')[0], url: `/religion#${slugify(g.name)}`, type: 'god' });
        });

        // Organizations
        data.organizations?.forEach(o => {
            t.push({ term: o.name, url: `/organizations#${slugify(o.name)}`, type: 'org' });
        });

        // Regions & Cities (Deep linking)
        data.planes.forEach(p => p.continents.forEach(c => {
            c.regions.forEach(reg => {
                t.push({ term: reg.name, url: `/continent/${c.id}/${slugify(reg.name)}`, type: 'region' });

                reg.cities.forEach(city => {
                    t.push({ term: city.name, url: `/continent/${c.id}/${slugify(reg.name)}/${slugify(city.name)}`, type: 'city' });
                });
            });
        }));

        // Sort by length desc to prioritize longer matches (e.g. "High Elf" before "Elf")
        return t.sort((a, b) => b.term.length - a.term.length);
    }, []);

    // Create a master regex for all terms
    // We escape special regex characters in terms just in case
    const parts = useMemo(() => {
        if (terms.length === 0) return [text];

        // Create a single regex pattern: (Term1|Term2|Term3)
        // We escape special chars (like parens in names)
        const pattern = terms.map(t => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        const regex = new RegExp(`(${pattern})`, 'gi');

        const split = text.split(regex);

        return split.map((part, i) => {
            // Check if this part matches any term (case insensitive)
            const match = terms.find(t => t.term.toLowerCase() === part.toLowerCase());

            if (match) {
                let color = 'var(--color-accent-inferia)'; // default
                if (match.type === 'continent') color = '#f1c40f';
                if (match.type === 'god') color = 'var(--color-accent-superia)';
                if (match.type === 'region' || match.type === 'city') color = '#2ecc71';

                return (
                    <Link
                        key={`${match.term}-${i}`}
                        to={match.url}
                        style={{ color: color, fontWeight: 500, textDecoration: 'none', borderBottom: `1px dotted ${color}` }}
                    >
                        {part}
                    </Link>
                );
            }
            return part;
        });
    }, [text, terms]);

    return <>{parts}</>;
};
