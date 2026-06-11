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
        primary: {
          DEFAULT: '#1A6B3C',
          dark: '#114a29',
          light: '#25884f',
        },
        secondary: {
          DEFAULT: '#2ECC71',
          light: '#a9f0c7',
        },
        accent: {
          DEFAULT: '#F0A500',
        },
        nature: {
          bg: '#F7F9F5',
          darkBg: '#0D1F16',
          darkText: '#E8F5E1',
          card: '#FFFFFF',
          cardDark: '#122D20',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        nature: '0 10px 30px -10px rgba(26, 107, 60, 0.08)',
        natureHover: '0 20px 40px -15px rgba(26, 107, 60, 0.15)',
      }
    },
  },
  plugins: [],
}
