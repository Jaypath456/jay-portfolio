/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0f172a",
        bgCard: "#1e293b",
        heading: "#e2e8f0",
        textDim: "#94a3b8",
        accent: "#64ffda",
        navActive: "#ccd6f6",
      },
    },
  },
  plugins: [],
}