import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        postal: {
          blue: "#3C6E91",
          red: "#C1443C",
          beige: "#D9CBA3",
          mint: "#A8D5BA",
        },
        paper: "#F9F6F0",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["'Playfair Display'", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
