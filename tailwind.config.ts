import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#070711",
        ember: "#D8A64A",
        aureate: "#F7D891",
        violet: "#8E6BFF",
        wine: "#2B0F27"
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 55px rgba(216, 166, 74, 0.20)",
        violet: "0 0 60px rgba(142, 107, 255, 0.18)"
      },
      backgroundImage: {
        "gold-radial": "radial-gradient(circle at 50% 0%, rgba(216,166,74,.28), transparent 36%)",
        "violet-radial": "radial-gradient(circle at 80% 20%, rgba(142,107,255,.18), transparent 34%)"
      }
    }
  },
  plugins: []
};

export default config;
