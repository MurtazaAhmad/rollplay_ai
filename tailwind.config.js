/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/ui/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--inter-font)", "sans-serif"],
      },
      colors: {
        dark: "#111",
        main: '#00b8b7'
      },
      backgroundImage: {
        girl: "url('/assets/bg-wholesome-yae-miko.png')"
      }
    },
  },
  plugins: [require("@headlessui/tailwindcss")({ prefix: "ui" })],
};
