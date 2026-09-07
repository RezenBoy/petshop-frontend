/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#244A83",
        accent: "#F5AC3A",
        background: "#FAF3EA",
        surface: "#FBF9F5",
        text: "#172F55",
        textMuted: "#6B7078",
        "text-muted": "#6B7078",
        secondary: "#C7D3E3",
        secondaryAccent: "#F3CE8F",
        "secondary-accent": "#F3CE8F",
        catBrown: "#4D3D22",
        "cat-brown": "#4D3D22",
        border: "#C7D3E3",
        gradient: {
          from: "#244A83",
          to: "#C7D3E3",
        },
      },
    },
  },
  plugins: [],
};
