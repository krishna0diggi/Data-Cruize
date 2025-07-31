// tailwind.config.ts
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        redOrange: '#FF3621',
        springWood: '#F9F7F4',
        gableGreen: '#1B3139',
        'redOrange-foreground': '#fff',
        'springWood-foreground': '#1B3139',
        'gableGreen-foreground': '#F9F7F4',
      },
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  // Removed invalid 'safelist' property. If you need to safelist classes, use the 'safelist' option in tailwind.config.js (not .ts) or configure purge/content properly.
  plugins: [],
};

export default config;
