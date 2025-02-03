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
      xl: "1280px", 
      '2xl': "1536px",
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
      spacing: {
        18: '4.5rem', 
        22: '5.5rem',
        24: '6rem',
      },
      fontSize: {
        'xxs': '.75rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
    },
  },
  plugins: [],
}

