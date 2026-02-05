export const config = {
    runtime: 'edge', // Use Edge runtime for speed
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const { query, context } = await req.json();

        if (!process.env.GROQ_API_KEY) {
            // Allow graceful fallback on client if no key is set
            return new Response(JSON.stringify({ error: 'No API Key configured' }), { status: 501 });
        }

        const systemPrompt = `Du er en vidsom, men kryptisk Orakel-AI i fantasy-verdenen 'Det Faldne Hjerte'.
Verdenen er splittet, mørk og fyldt med magi.
Din stemme skal være atmosfærisk, mystisk og kortfattet.
Besvar spillerens spørgsmål baseret på din viden.
Hvis context er givet, brug det.
Context: \${context || 'Ingen specifik kontekst.'}
`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer \${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile', // Fast, cheap, and very smart
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: query }
                ],
                max_tokens: 150,
                temperature: 0.7,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Groq API Error');
        }

        const aiText = data.choices[0]?.message?.content || "Tågen skjuler svaret.";

        return new Response(JSON.stringify({ text: aiText }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
