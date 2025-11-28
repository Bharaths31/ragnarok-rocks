/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light Mode: Ceramic White / Clean Tech
        light: { 
          bg: '#F0F2F5', 
          card: '#FFFFFF', 
          text: '#1A1A1A' 
        },
        // Dark Mode: Cyber Security / Deep Space
        dark: { 
          bg: '#0D1117', 
          card: '#161B22', 
          text: '#E6EDF3' 
        },
        // Accents: Neon & Data Streams
        accent: { 
          cyan: '#00f0ff',   // Cyberpunk Cyan
          purple: '#bc13fe', // Quantum Purple
          green: '#0aff68'   // Terminal Green
        }
      },
      borderRadius: {
        '3xl': '1.5rem', // Extra smooth corners
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Clean, modern font
      },
    },
  },
  plugins: [],
}