/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#304B82",
        accent: "#EFB851",
        background: "#FBF7EC",
        surface: "#FFFDF8",
        text: "#20252B",
        textMuted: "rgba(32, 37, 43, 0.6)",
        "text-muted": "rgba(32, 37, 43, 0.6)",
        secondary: "#A8B89A",
        border: "#A8B89A",
        gradient: {
          from: "#304B82",
          to: "#A8B89A",
        },
      },
    },
  },
  plugins: [],
};
