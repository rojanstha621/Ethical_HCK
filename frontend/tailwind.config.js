/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        surface: "#0A0A0A",
        border: "#1A1A1A",
        accent: {
          red: "#FF0000",
          redLight: "#FF3333",
          redDark: "#CC0000",
        },
        text: {
          primary: "#FFFFFF",
          muted: "#CCCCCC",
          secondary: "#999999",
        },
      },
      fontFamily: {
        heading: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.18) 1px, transparent 0)",
      },
      boxShadow: {
        "soft-glow":
          "0 0 40px rgba(0,245,160,0.25), 0 0 80px rgba(0,198,255,0.25)",
      },
    },
  },
  plugins: [],
};
