/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'shadow-pulse': {
          '0%, 100%': { 
            transform: 'scaleX(1)', 
            opacity: '0.4' 
          },
          '50%': { 
            transform: 'scaleX(0.8)', 
            opacity: '0.2' 
          },
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shadow-move': 'shadow-pulse 3s ease-in-out infinite',
      },
      colors: {
        // Ensure your 'primary' color is defined so the UI inside the laptop shows up
        primary: {
          DEFAULT: '#734c9a', // Using the purple from your charts
          light: '#a78bfa',
        },
        background: {
          dark: '#0f172a',
        }
      }
    },
  },
  plugins: [],
};