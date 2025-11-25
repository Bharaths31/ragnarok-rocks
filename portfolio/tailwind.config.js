/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cyber-black': '#0a0a0a',
        'cyber-dark': '#111111',
        'cyber-gray': '#1f1f1f',
        'neon-blue': '#00f3ff',
        'neon-purple': '#bd00ff',
        'neon-green': '#00ff9f',
        'glass-white': 'rgba(255, 255, 255, 0.1)',
        'glass-black': 'rgba(0, 0, 0, 0.5)',
      },
      backgroundSize: {
        '300%': '300%',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00f3ff, 0 0 10px #00f3ff' },
          '100%': { boxShadow: '0 0 20px #00f3ff, 0 0 30px #00f3ff' },
        }
      }
    },
  },
  plugins: [],
}
