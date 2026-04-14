import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#222023",
          plum: "#522A6F",
          pink: "#F29CB7",
          gold: "#FBCF4F",
          lilac: "#DDAAFF",
          neutral: "#EFEBE8",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        sans: ["var(--font-open-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-avenir)", "var(--font-open-sans)", "ui-sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
