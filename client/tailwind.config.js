/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#CB11AB',
          dark: '#9c0082',
          light: '#fdf0fb',
        },
        navy: {
          DEFAULT: '#1c1032',
        },
        orange: {
          DEFAULT: '#ff6b00',
        }
      },
    },
  },
  plugins: [],
};