/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary (Brand Blue)
        primary: {
          DEFAULT: '#2563EB', // primary
          light: '#3B82F6',   // primary-light
          dark: '#1E3A8A',    // primary-dark
        },

        // Secondary (Background Blues)
        secondary: {
          light: '#DBEAFE', // secondary-light
          soft: '#EFF6FF',  // secondary-soft
        },

        // Accent
        'accent-orange': '#F59E0B',
        'accent-orange-dark': '#F97316',
        'accent-green': '#10B981',

        // Neutral / Text
        'text-dark': '#111827',
        'text-medium': '#374151',
        'text-light': '#6B7280',
        border: '#E5E7EB',
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
};
