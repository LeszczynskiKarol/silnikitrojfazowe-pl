/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          50: "#f7f8fa",
          100: "#eef0f4",
          200: "#dde1e9",
          300: "#c0c6d2",
          400: "#8b94a6",
          500: "#5d6675",
          600: "#3e4654",
          700: "#2a313d",
          800: "#1a1f29",
          900: "#0f131a",
        },
        accent: {
          DEFAULT: "#0891b2",
          dark: "#0e7490",
          soft: "#cffafe",
        },
      },
    },
  },
  plugins: [],
};
