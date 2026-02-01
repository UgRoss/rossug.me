import typography from '@tailwindcss/typography'
import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  plugins: [animate, typography],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgba(0, 0, 0, 0.85)',
          light: 'rgba(255, 255, 255, 0.9)'
        },
        secondary: {
          DEFAULT: 'rgba(0, 0, 0, 0.4)',
          light: 'rgba(255, 255, 255, 0.4)'
        },
        tertiary: {
          DEFAULT: 'rgba(0, 0, 0, 0.24)',
          light: 'rgba(255, 255, 255, 0.24)'
        }
      },
      fontFamily: {
        mono: [
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace'
        ],
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif'
        ],
        serif: ['Besley', 'Baskerville', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif']
      },
      maxWidth: {
        content: '35rem'
      }
    }
  }
}
