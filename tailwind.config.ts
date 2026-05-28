import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm off-white base
        cream: {
          50: "#fefdf8",
          100: "#fdf9ed",
          200: "#faf3d6",
          300: "#f5e8b8",
          400: "#edd99a",
          500: "#e0c56e",
        },
        // Muted sage green
        sage: {
          50: "#f4f7f4",
          100: "#e6ede6",
          200: "#ccdacc",
          300: "#a8c0a8",
          400: "#7da07d",
          500: "#5d825d",
          600: "#4a6b4a",
          700: "#3d573d",
          800: "#334733",
          900: "#2b3b2b",
        },
        // Muted blue-gray
        slate: {
          50: "#f8f9fa",
          100: "#f0f2f4",
          200: "#dde2e8",
          300: "#c3cdd6",
          400: "#9baab8",
          500: "#7a8fa0",
          600: "#607484",
          700: "#4f5f6e",
          800: "#3d4a57",
          900: "#2e3840",
        },
        // Warm charcoal text
        charcoal: {
          50: "#f6f6f5",
          100: "#e9e8e6",
          200: "#d3d1cc",
          300: "#b3b0a8",
          400: "#8e8b82",
          500: "#6e6b62",
          600: "#5a574f",
          700: "#4a4840",
          800: "#3d3b34",
          900: "#2a2922",
        },
        // Soft muted amber
        amber: {
          50: "#fdf8f0",
          100: "#faeedd",
          200: "#f4d9b0",
          300: "#ecbf7a",
          400: "#e19f42",
          500: "#c87e28",
        },
        // Recovery purple (gentle)
        serenity: {
          50: "#f5f3fa",
          100: "#ebe6f5",
          200: "#d5cbea",
          300: "#b6a4d8",
          400: "#9278c0",
          500: "#7559a8",
          600: "#614590",
          700: "#513877",
          800: "#453063",
          900: "#3a2852",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-lora)", "Georgia", "serif"],
        dyslexic: ["var(--font-opendyslexic)", "Arial", "sans-serif"],
      },
      fontSize: {
        "reading-sm": ["1rem", { lineHeight: "1.85", letterSpacing: "0.01em" }],
        "reading-base": ["1.125rem", { lineHeight: "1.9", letterSpacing: "0.01em" }],
        "reading-lg": ["1.25rem", { lineHeight: "1.95", letterSpacing: "0.015em" }],
        "reading-xl": ["1.5rem", { lineHeight: "2.0", letterSpacing: "0.015em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "calm": "0 2px 20px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.03)",
        "calm-md": "0 4px 30px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
        "calm-lg": "0 8px 48px rgba(0,0,0,0.08), 0 3px 12px rgba(0,0,0,0.05)",
        "inner-soft": "inset 0 1px 4px rgba(0,0,0,0.05)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "breathe": "breathe 4s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      transitionTimingFunction: {
        "calm": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
    },
  },
  plugins: [],
};

export default config;
