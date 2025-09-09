import { heroui } from "@heroui/react";
import scrollbar from "tailwind-scrollbar"
 

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [heroui(), scrollbar({ nocompatible: true })],
};

// @plugin 'tailwind-scrollbar';
