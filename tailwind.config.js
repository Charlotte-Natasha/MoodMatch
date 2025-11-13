// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-purple-dark': '#2F0222',
        'brand-accent-pink': '#A35D8A',
        'mood-happy': '#FFA500',
        'mood-energetic': '#2F0222',
        'mood-calm': '#7DF9FF',
        'mood-sad': '#000080',
        'mood-romantic': '#FF69B4',
        'mood-focused': '#B56CFF',
      },
      fontFamily: {
        'header': ['LobsterTwo', 'serif'],
        'body': ['Poppins', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
