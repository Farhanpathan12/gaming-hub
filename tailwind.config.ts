import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // --- Core Canvas ---
                canvas: '#07071a',          // Deep indigo-black
                surface: '#0d0d2b',         // Card base — deep indigo
                'surface-2': '#12123a',     // Elevated surface
                border: '#1e1e4a',          // Subtle indigo border
                // --- Indigo / Purple spectrum (Primary System) ---
                indigo: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    DEFAULT: '#6366f1',     // Core indigo — buttons, highlights
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                purple: {
                    DEFAULT: '#a855f7',     // Vivid purple
                    dim: '#7c3aed',
                    glow: '#d8b4fe',
                },
                // --- Gold (Secondary accent) ---
                gold: {
                    DEFAULT: '#f59e0b',
                    dim: '#d97706',
                    glow: '#fcd34d',
                },
                // --- Rose (Status) ---
                rose: {
                    DEFAULT: '#f43f5e',
                    glow: '#fda4af',
                },
                // --- Text system ---
                ink: {
                    DEFAULT: '#e2e8f0',
                    muted: '#94a3b8',
                    faint: '#334155',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                heading: ['var(--font-space-grotesk)', 'sans-serif'],
            },
            backgroundImage: {
                // Global body ambient mesh
                'space-mesh': [
                    'radial-gradient(ellipse 90% 60% at 15% -5%, rgba(99,102,241,0.18) 0%, transparent 55%)',
                    'radial-gradient(ellipse 70% 50% at 85% 105%, rgba(168,85,247,0.14) 0%, transparent 55%)',
                    'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(7,7,26,1) 0%, transparent 80%)',
                ].join(', '),
                // Indigo → purple gradient
                'hero-gradient': 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                // CTA buttons
                'indigo-gradient': 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                'purple-gradient': 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                // Gold for secondary
                'gold-gradient': 'linear-gradient(135deg, #f59e0b 0%, #d97706 60%, #fcd34d 100%)',
                'gold-gradient-h': 'linear-gradient(90deg, #f59e0b, #d97706)',
                // Aurora sweep
                'aurora': 'linear-gradient(135deg, #6366f1 0%, #a855f7 40%, #ec4899 80%, #f59e0b 100%)',
                // Glow text
                'text-aurora': 'linear-gradient(100deg, #a5b4fc 0%, #c084fc 50%, #f0abfc 100%)',
            },
            boxShadow: {
                'indigo': '0 0 30px rgba(99,102,241,0.35), 0 0 60px rgba(99,102,241,0.15)',
                'indigo-sm': '0 0 12px rgba(99,102,241,0.3)',
                'purple': '0 0 30px rgba(168,85,247,0.4), 0 0 60px rgba(168,85,247,0.2)',
                'purple-sm': '0 0 12px rgba(168,85,247,0.3)',
                'gold': '0 0 25px rgba(245,158,11,0.3), 0 0 50px rgba(245,158,11,0.12)',
                'gold-sm': '0 0 10px rgba(245,158,11,0.25)',
                'panel': '0 1px 3px rgba(0,0,0,0.6), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
                'panel-hover': '0 0 0 1px rgba(99,102,241,0.3), 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
                'glow-hero': '0 0 80px rgba(99,102,241,0.25), 0 0 160px rgba(168,85,247,0.15)',
            },
            keyframes: {
                'fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'shimmer': {
                    '0%': { transform: 'translateX(-150%) skewX(-20deg)' },
                    '100%': { transform: 'translateX(300%) skewX(-20deg)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '33%': { transform: 'translateY(-10px) rotate(1deg)' },
                    '66%': { transform: 'translateY(-6px) rotate(-0.5deg)' },
                },
                'aurora-move': {
                    '0%, 100%': { 'background-position': '0% 50%' },
                    '50%': { 'background-position': '100% 50%' },
                },
                'orb-pulse': {
                    '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
                    '50%': { opacity: '1', transform: 'scale(1.08)' },
                },
                'spin-slow': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                'gradient-x': {
                    '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
                    '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
                },
                'border-flow': {
                    '0%': { 'background-position': '0% 50%' },
                    '100%': { 'background-position': '200% 50%' },
                },
                'ping-slow': {
                    '0%, 100%': { opacity: '0', transform: 'scale(1)' },
                    '50%': { opacity: '0.4', transform: 'scale(1.6)' },
                },
            },
            animation: {
                'fade-up': 'fade-up 0.7s ease-out forwards',
                'shimmer': 'shimmer 2.5s ease-in-out infinite',
                'float': 'float 7s ease-in-out infinite',
                'aurora-move': 'aurora-move 6s ease-in-out infinite',
                'orb-pulse': 'orb-pulse 4s ease-in-out infinite',
                'spin-slow': 'spin-slow 20s linear infinite',
                'gradient-x': 'gradient-x 4s ease infinite',
                'border-flow': 'border-flow 3s linear infinite',
                'ping-slow': 'ping-slow 2.5s ease-in-out infinite',
            },
        },
    },
    plugins: [
        plugin(function ({ addUtilities }) {
            addUtilities({
                '.panel': {
                    'background': 'rgba(13, 13, 43, 0.7)',
                    'backdrop-filter': 'blur(20px)',
                    '-webkit-backdrop-filter': 'blur(20px)',
                    'border': '1px solid rgba(30, 30, 74, 0.9)',
                },
                '.panel-elevated': {
                    'background': 'rgba(18, 18, 58, 0.85)',
                    'backdrop-filter': 'blur(24px)',
                    '-webkit-backdrop-filter': 'blur(24px)',
                    'border': '1px solid rgba(30, 30, 74, 0.7)',
                },
                '.panel-gold': {
                    'background': 'rgba(18, 18, 58, 0.9)',
                    'backdrop-filter': 'blur(24px)',
                    '-webkit-backdrop-filter': 'blur(24px)',
                    'border': '1px solid rgba(245, 158, 11, 0.2)',
                },
                '.panel-indigo': {
                    'background': 'rgba(99, 102, 241, 0.06)',
                    'backdrop-filter': 'blur(24px)',
                    '-webkit-backdrop-filter': 'blur(24px)',
                    'border': '1px solid rgba(99, 102, 241, 0.2)',
                },
                '.text-gradient-gold': {
                    'background': 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #fcd34d 100%)',
                    '-webkit-background-clip': 'text',
                    '-webkit-text-fill-color': 'transparent',
                    'background-clip': 'text',
                },
                '.text-gradient-aurora': {
                    'background': 'linear-gradient(100deg, #a5b4fc 0%, #c084fc 50%, #f0abfc 100%)',
                    '-webkit-background-clip': 'text',
                    '-webkit-text-fill-color': 'transparent',
                    'background-clip': 'text',
                },
                '.text-gradient-hero': {
                    'background': 'linear-gradient(110deg, #fff 0%, #c4b5fd 40%, #a78bfa 70%, #818cf8 100%)',
                    '-webkit-background-clip': 'text',
                    '-webkit-text-fill-color': 'transparent',
                    'background-clip': 'text',
                },
                '.label': {
                    'font-size': '10px',
                    'font-weight': '700',
                    'letter-spacing': '0.16em',
                    'text-transform': 'uppercase',
                },
                '.glass-border': {
                    'background': 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(168,85,247,0.2), rgba(99,102,241,0.1))',
                    'padding': '1px',
                    'border-radius': 'inherit',
                },
            });
        })
    ],
};

export default config;
