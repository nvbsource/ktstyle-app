/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Bao gồm tất cả các file trong src
  theme: {
    extend: {
      screens: {
        lg: "992px", // Thay đổi breakpoint lg thành 992px
      },
    },
  },
  plugins: [],
};