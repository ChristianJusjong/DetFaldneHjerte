/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: '#0A0A0F', // Deeper obsidian for more contrast
                surface: 'rgba(25, 25, 35, 0.45)', // Slightly more opaque glass
                'surface-highlight': 'rgba(50, 50, 70, 0.6)', 
                superia: '#fcd34d', // Bright premium Gold
                'superia-light': '#fef3c7',
                superia_dim: '#b48a1d', // Metallic Gold
                inferia: '#ef4444', // Bright Blood Red
                'inferia-light': '#fee2e2',
                inferia_dim: '#7f1d1d', // Deep Blood Red
                'text-main': '#f9fafb', // Brighter text
                'text-dim': '#9ca3af', 
                border: 'rgba(255, 255, 255, 0.08)', 
            },
            fontFamily: {
                main: ['"Inter"', 'sans-serif'],
                serif: ['"Cinzel"', 'serif'],
            },
            boxShadow: {
                premium: '0 10px 40px -10px rgba(0, 0, 0, 0.7)', 
                'premium-hover': '0 0 30px rgba(252, 211, 77, 0.12)',
                glass: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
                'glass-gold': '0 8px 32px 0 rgba(180, 138, 29, 0.15)',
                'glass-red': '0 8px 32px 0 rgba(127, 29, 29, 0.15)',
            },
            backdropBlur: {
                xs: '2px',
                '2xl': '40px',
            },
            animation: {
                'fade-in': 'fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                'slide-down': 'slideDown 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                'pulse-slow': 'pulseSlow 6s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow-pulse': 'glowPulse 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulseSlow: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glowPulse: {
                    '0%, 100%': { opacity: '0.3', filter: 'blur(8px)' },
                    '50%': { opacity: '0.6', filter: 'blur(12px)' },
                }
            }
        },
    },
    plugins: [],
}
