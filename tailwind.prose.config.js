/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/components/ServiceLayout.tsx',
    './app/portfolio/[slug]/ProjectPageClient.tsx',
    './app/[...slug]/page.tsx',
  ],
  darkMode: 'class',
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
