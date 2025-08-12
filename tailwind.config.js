// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{css,scss}',
  ],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/typography')],
};
