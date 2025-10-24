/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./contexts/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Leli Rentals Brand Colors
        primary: {
          brand: '#3b82f6',
          foreground: '#ffffff',
        },
        background: '#fefce8',
        card: '#ffffff',
        muted: {
          background: '#f9fafb',
          text: '#6b7280',
        },
        text: {
          primary: '#374151',
          secondary: '#6b7280',
          light: '#ffffff',
        },
        border: '#e5e7eb',
        success: '#10b981',
        error: '#dc2626',
        warning: '#f59e0b',
        info: '#3b82f6',
        // Vibrant colors
        vibrant: {
          purple: '#8b5cf6',
          plum: '#8b5cf6',
          pink: '#ec4899',
          green: '#10b981',
          orange: '#f59e0b',
          red: '#ef4444',
          teal: '#14b8a6',
          indigo: '#6366f1',
          cyan: '#06b6d4',
          lime: '#84cc16',
          yellow: '#eab308',
          rose: '#f43f5e',
          blue: '#3b82f6',
        },
        // Chart colors
        chart: {
          1: '#d97706',
          2: '#f59e0b',
          3: '#fbbf24',
          4: '#fcd34d',
          5: '#fde68a',
        },
        // Category colors
        category: {
          electronics: '#3b82f6',
          tools: '#f97316',
          furniture: '#8b5cf6',
          vehicles: '#10b981',
          sports: '#ec4899',
          clothing: '#f59e0b',
          books: '#14b8a6',
          music: '#6366f1',
          home: '#ef4444',
          garden: '#84cc16',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'button': '0 4px 14px 0 rgba(0, 0, 0, 0.15)',
        'logo': '0 4px 14px 0 rgba(217, 119, 6, 0.3)',
      },
    },
  },
  plugins: [],
}
