import { getLore } from './data';

export const getContextFromPath = (pathname: string): string | null => {
    const data = getLore();
    const parts = pathname.split('/').filter(Boolean);

    if (parts.length < 2) return null;

    const type = parts[0];
    const id = decodeURIComponent(parts[1]).toLowerCase();

    // Helper to normalize strings for comparison
    const norm = (s: string) => s.toLowerCase().replace(/ /g, '-');

    if (type === 'city') {
        for (const plane of data.planes) {
            for (const continent of plane.continents) {
                for (const region of continent.regions) {
                    const city = region.cities.find(c => norm(c.name) === id || c.name.toLowerCase() === id);
                    if (city) {
                        return `Brugeren ser i øjeblikket på byen **${city.name}** i regionen ${region.name}. Beskrivelse: ${city.desc}. ${city.rumor ? `Rygte: ${city.rumor}` : ''}`;
                    }
                }
            }
        }
    }

    if (type === 'region') {
        for (const plane of data.planes) {
            for (const continent of plane.continents) {
                const region = continent.regions.find(r => norm(r.name) === id);
                if (region) {
                    return `Brugeren ser i øjeblikket på regionen **${region.name}** på kontinentet ${continent.name}. Hovedstad: ${region.capital}. Beskrivelse: ${region.desc}`;
                }
            }
        }
    }

    if (type === 'continent') {
        for (const plane of data.planes) {
            const continent = plane.continents.find(c => c.id === id || norm(c.name) === id);
            if (continent) {
                return `Brugeren ser i øjeblikket på kontinentet **${continent.name}** (${continent.title}). Beskrivelse: ${continent.description}`;
            }
        }
    }

    if (type === 'race') {
        for (const plane of data.planes) {
            for (const continent of plane.continents) {
                const race = continent.races.find(r => norm(r.name) === id);
                if (race) {
                    return `Brugeren ser i øjeblikket på racen **${race.name}**. Beskrivelse: ${race.description}`;
                }
            }
        }
    }

    if (type === 'organization') {
        const org = data.organizations?.find(o => norm(o.name) === id);
        if (org) {
            return `Brugeren ser i øjeblikket på organisationen **${org.name}**. Loyalitet: ${org.loyalty}. Beskrivelse: ${org.desc}`;
        }
    }

    if (type === 'god') {
        const god = data.religion.gods.find(g => norm(g.name) === id);
        if (god) {
            return `Brugeren ser i øjeblikket på guden **${god.name}**, gud for ${god.domain}. Symbol: ${god.symbol}.`;
        }
    }

    return null;
};
