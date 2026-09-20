/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#090b09',
        ink: '#121513',
        slab: '#181c19',
        slab2: '#1f2420',
        rule: '#2c322d',
        rulesoft: '#1c211d',
        bone: '#e8eee8',
        muted: '#9aa79c',
        faint: '#7c887e',
        signal: '#b6d7bb',
        ember: '#d5ecd8',
        win: '#e3c98a',
        loss: '#e08e84',
        brandOrange: '#ff5924'
      },
      fontFamily: {
        display: ['Chillax', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
      }
    },
  },
  plugins: [],
}
