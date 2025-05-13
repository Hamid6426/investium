// tailwind.config.js
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'], 
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // your custom colors, etc.
    },
  },
  plugins: [],
};
