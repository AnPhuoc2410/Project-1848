/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        zentry: ['Zentry', 'sans-serif'],
        general: ['General', 'sans-serif'],
        'robert-medium': ['Robert-Medium', 'sans-serif'],
        'robert-regular': ['Robert-Regular', 'sans-serif'],
        'circular-web': ['Circular-Web', 'sans-serif'],
        'eb-garamond': ['"EB Garamond"', 'serif'],
        'crimson-text': ['"Crimson Text"', 'serif'],
      },
      colors: {
        primary: '#002244', // Navy
        secondary: '#B31B1B', // Red
        cta: '#B31B1B', // Red
        background: '#F8F8F8', // Off-white
        text: '#111111', // Near-black
        blue: {
          50: '#DFDFF0',
          75: '#DFDFF2',
          100: '#F0F2FA',
          200: '#010101',
          300: '#4FB7DD',
        },
        violet: {
          300: '#5724FF',
        },
        yellow: {
          100: '#8E983F',
          300: '#EDFF66',
        },
      },
    },
  },
  plugins: [],
};
