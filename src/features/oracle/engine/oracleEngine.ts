import { getLore } from '@/features/lore/utils/data';

interface OracleResponse {
    text: string;
}

// --- LOCAL LOGIC (FALLBACK) ---
const queryLocalLore = (query: string, context?: string): OracleResponse => {
    const lowerQuery = query.toLowerCase();
    const data = getLore();
    let answer = "Jeg ser tåge... Spørg mere specifikt.";
    let found = false;

    // 0. Contextual Awareness
    if (context && (lowerQuery.includes('her') || lowerQuery.includes('dette') || lowerQuery.includes('denne') || lowerQuery.includes('by') || lowerQuery.includes('hvem') || lowerQuery.includes('rygte') || lowerQuery.includes('fortæl'))) {
        answer = `${context} \n\n(Kontekstuel viden)`;
        found = true;
    }

    // 1. Gods
    if (!found) {
        for (const g of data.religion.gods) {
            if (lowerQuery.includes(g.name.toLowerCase()) || lowerQuery.includes(g.domain.toLowerCase())) {
                answer = `Ah, **${g.name}**. Guden for ${g.domain}. Deres symbol er ${g.symbol}. ${g.followers ? `De følges af ${g.followers}.` : ''}`;
                found = true;
                break;
            }
        }
    }

    // 2. Continents & Races
    if (!found) {
        for (const p of data.planes) {
            if (found) break;
            for (const c of p.continents) {
                if (lowerQuery.includes(c.name.toLowerCase())) {
                    answer = `${c.name}, også kendt som "${c.title}". ${c.description.substring(0, 150)}... ${c.culturalQuote ? `Som de siger: "${c.culturalQuote}"` : ''}`;
                    found = true;
                    break;
                }
                for (const r of c.races) {
                    if (lowerQuery.includes(r.name.toLowerCase())) {
                        answer = `**${r.name}**. ${r.description} (Mekanik: ${r.mechanic})`;
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }
        }
    }

    // 3. Conflict
    if (!found && (lowerQuery.includes('konflikt') || lowerQuery.includes('krig') || lowerQuery.includes('sygdom') || lowerQuery.includes('autoimmun'))) {
        answer = `Du spørger om **${data.conflict.title}**. ${data.conflict.description}`;
        found = true;
    }

    // 4. Fallback
    if (!found) {
        if (context) {
            answer = `Jeg er ikke sikker på præcis hvad du mener, men du befinder dig et sted med historie: ${context}`;
        } else {
            answer = `Jeg hører din stemme, men ${query} er skjult for mig i øjeblikket. Prøv at spørge om en Gud, en Race eller et Kontinent.`;
        }
    }

    return { text: answer };
};

// --- PUBLIC API ---

export const queryOracle = async (query: string, context?: string): Promise<OracleResponse> => {
    try {
        // Attempt to call serverless function
        // Note: This will fail in 'npm run dev' without a proxy, triggering fallback.
        // It will work in 'vercel dev' or production.
        const response = await fetch('/api/oracle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, context })
        });

        if (!response.ok) {
            // If API is missing (404), not configured (501), or errors (500)
            console.warn(`Oracle API unavailable (${response.status}). Falling back to local lore.`);
            throw new Error(`API Error ${response.status}`);
        }

        const data = await response.json();
        return { text: data.text };

    } catch {
        // Fallback to local engine
        return queryLocalLore(query, context);
    }
};
