import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E8D49E",
          dark: "#A07830",
        },
        onyx: "rgb(var(--onyx-rgb) / <alpha-value>)",
        "warm-black": "rgb(var(--warm-black-rgb) / <alpha-value>)",
        ivory: "rgb(var(--ivory-rgb) / <alpha-value>)",
        muted: "rgb(var(--muted-rgb) / <alpha-value>)",
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)"],
        jost: ["var(--font-jost)"],
      },
    },
  },
  plugins: [],
};
export default config;
