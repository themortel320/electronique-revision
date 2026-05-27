import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
      },
      backgroundImage: {
        "hero-light": "radial-gradient(ellipse 80% 60% at 50% -10%, #dbeafe 0%, transparent 70%)",
        "hero-dark":  "radial-gradient(ellipse 80% 60% at 50% -10%, #1e3a8a22 0%, transparent 70%)",
      },
      boxShadow: {
        glow:    "0 0 20px rgba(59,130,246,0.25)",
        "glow-lg": "0 0 40px rgba(59,130,246,0.20)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
