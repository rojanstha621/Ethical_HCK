/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050509",
        surface: "#0B0F19",
        border: "#1F2933",
        accent: {
          green: "#00F5A0",
          blue: "#00C6FF",
        },
        text: {
          primary: "#F9FAFB",
          muted: "#9CA3AF",
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
