import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        coral: 'var(--coral)',
        periwinkle: 'var(--periwinkle)',
        lilac: 'var(--lilac)',
        danger: 'var(--danger)',
        'ink-high': 'var(--ink-high)',
        'ink-muted': 'var(--ink-muted)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
