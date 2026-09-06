/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#ffffff",
        bgColor: "#f2f0f1",
        red: "#ff3333",
        variant0: "#4F4631",
        variant1: "#314F4A",
        variant2: "#31344F",
        redAlpha60: "#FF33331A",
        blackAlpha10: "#0000001A"
      },
      fontFamily: {
        integral: ["Integral CF", "sans-serif"],
        satoshi: ["Satoshi", "sans-serif"],
      },
      fontSize: {
        10: "0.625rem",
        24: "1.5rem",
        28: "1.75rem",
        32: "2rem",
        36: "2.25rem",
        40: "2.5rem",
        48: "3rem",
        64: "4rem"
      },
    },
  },

  plugins: [],
};
