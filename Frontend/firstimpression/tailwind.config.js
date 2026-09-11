/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'theme-red-start': 'var(--theme-red-start)',
        'theme-red-end': 'var(--theme-red-end)',
        'theme-red': 'var(--theme-red)',
        'theme-red-hover': 'var(--theme-red-hover)',
      }
    },
  },
  plugins: [],
};

