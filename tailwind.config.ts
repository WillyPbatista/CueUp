import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        gold: 'var(--color-gold)',
        bg: 'var(--bg-primary)',
        card: 'var(--bg-card)',
      },
      boxShadow: {
        glow: 'var(--shadow-glow-green)',
      },
    },
  },
  plugins: [],
} satisfies Config;
