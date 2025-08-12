
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Use class-based dark mode so that dark styles only apply when the
  // `.dark` class is present on the root element.  This avoids
  // conflicting with the user's OS-level dark mode preference.  Without
  // this setting Tailwind defaults to `media`, meaning `dark:` styles
  // automatically apply when the system prefers dark mode even if the
  // site's toggle is off.  See https://tailwindcss.com/docs/dark-mode
  darkMode: 'class',
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/typography')],
};
