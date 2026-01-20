/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: '#1a1d21', // Deep Slate
                surface: '#25282e', // Stonework
                superia: '#ffd700', // Mystic Gold
                inferia: '#8a1c1c', // Blood Crimson
                text: {
                    DEFAULT: '#e2e8f0',
                    dim: '#94a3b8',
                },
                border: '#475569',
            },
            fontFamily: {
                main: ['"Crimson Pro"', 'serif'],
                serif: ['"Cinzel"', 'serif'],
            },
            boxShadow: {
                premium: '0 10px 30px rgba(0, 0, 0, 0.5)',
                paper: '0 1px 3px rgba(0,0,0,0.3)',
            },
            backgroundImage: {
                'parchment': "url('https://www.transparenttextures.com/patterns/aged-paper.png')", // Fallback or use local if available later
            }
        },
    },
    plugins: [],
}
