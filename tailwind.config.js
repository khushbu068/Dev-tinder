/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#205781",
        secondary: "#4F959D",
        accent: "#98D2C0",
        highlight: "#F6F8D5",
      },
    },
  },
  plugins: [require("daisyui")],
 
};