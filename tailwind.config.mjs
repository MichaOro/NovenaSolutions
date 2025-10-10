// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}'],
  theme: { extend: {} },
  plugins: [],
  safelist: [
    // MasonryGrid Spalten
    'sm:grid-cols-1','sm:grid-cols-2','sm:grid-cols-3',
    'sm:grid-cols-4','sm:grid-cols-5','sm:grid-cols-6',
    // Card-Spans (falls Purge zu aggressiv ist)
    'sm:col-span-1','sm:col-span-2','sm:col-span-3',
    'sm:col-span-4','sm:col-span-5','sm:col-span-6',
    // Arbitrary utilities im Einsatz
    'sm:[grid-auto-flow:dense]','auto-rows-[var(--row)]'
  ],
};
