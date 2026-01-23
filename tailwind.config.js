/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: '#121212', // Deepest dungeon black
                surface: '#1e1e1e', // Dark stone
                'surface-highlight': '#2d2d2d', // Lighter stone for hover
                superia: '#d4af37', // Metallic Gold
                inferia: '#8a0d0d', // Deep Blood Red
                'text-main': '#e0d8c3', // Parchment Text
                'text-dim': '#8b8b8b', // Dimmed Text
                border: '#3d342b', // Dark Wood/Leather Border
            },
            fontFamily: {
                main: ['"Crimson Pro"', 'serif'],
                serif: ['"Cinzel"', 'serif'],
            },
            boxShadow: {
                premium: '0 0 20px rgba(212, 175, 55, 0.1)', // Subtle gold glow
                'premium-hover': '0 0 30px rgba(212, 175, 55, 0.25)',
                paper: '0 2px 10px rgba(0,0,0,0.5)',
                inset: 'inset 0 2px 4px rgba(0,0,0,0.6)',
            },
            backgroundImage: {
                'parchment': "url('https://www.transparenttextures.com/patterns/aged-paper.png')",
                'leather': "url('https://www.transparenttextures.com/patterns/black-scales.png')",
                'wood': "url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-down': 'slideDown 0.3s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            }
        },
    },
    plugins: [],
}
