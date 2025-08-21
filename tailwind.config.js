/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    {
      pattern: /(bg|text)-(red|emerald|blue|amber|slate)-(100|700)/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
