/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'vb-bg': 'var(--vb-bg)',
        'vb-text': 'var(--vb-text)',
      },
    },
  },
  plugins: [require('./src/plugin.cjs')],
  darkMode: 'class',
}
