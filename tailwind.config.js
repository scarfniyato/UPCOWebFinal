/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
    },
    extend: {
      colors: {
        dark: "#003A55",
        blue: "#02CAD6",
        white: "#FFFFFF",
        lblue: "#E2F1FF",
        fcolor: "#333333",
      },
      fontFamily: {
        main: ["Montserrat"],
      },
      backgroundImage: {
        'bgMain': "url('bg.png')",
      },
    },
  },
  plugins: [],
}

