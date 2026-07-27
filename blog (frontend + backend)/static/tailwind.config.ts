import type { Config } from "tailwindcss";

// Tells Tailwind which files to scan for class names.
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},   // add custom colors/fonts here later if you want
  },
  plugins: [],
};

export default config;
