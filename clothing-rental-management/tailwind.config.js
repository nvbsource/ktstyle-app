module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Đảm bảo rằng Tailwind sẽ quét toàn bộ các file trong thư mục src
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d33265', // Định nghĩa màu primary
      },
      fontFamily: {
        sans: ['Poppins', 'Arial', 'sans-serif'], // Thay thế font sans mặc định với Poppins
      },
    },
  },
  plugins: [],
}
