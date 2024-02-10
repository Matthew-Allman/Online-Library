module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/*.{jsx,js}"],
  theme: {
    container: {
      padding: {
        DEFAULT: "15px",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1000px",
      xl: "1300px",
    },
    extend: {
      colors: {
        green: "#019881",
        darkGreen: "#006A5A",
        lightBlue: "#E6F4FF",
        blue: "#0578D6",
        darkBlue: "#0F8DF4",
        darkestGray: "#1D262E",
        darkGray: "#4C555E",
        grey: "#A1A7AD",
        gray: "#707880",
        lighGray: "#DFE3E8",
        lGray: "#EEF0F3",
        lighterGray: "#F7F9FA",
        lightestGray: "#C7CDD4",
        darkerGray: "#28323B",
      },
    },
  },
  plugins: [],
};
