// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff1744', // Red A400
        'primary-foreground': '#fff',
        secondary: '#ff8a80', // Red lighten
        'secondary-foreground': '#fff',
        accent: '#ff5252', // Red accent
        'accent-foreground': '#fff',
        background: '#fff0f0', // Light red background
        foreground: '#b71c1c', // Dark red text
        muted: '#f8bbd0',
        'muted-foreground': '#ad1457',
        card: '#fff1f2',
        'card-foreground': '#b71c1c',
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
