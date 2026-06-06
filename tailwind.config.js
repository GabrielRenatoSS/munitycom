export default {
  content: [
    './resources/**/*.{js,jsx,ts,tsx,blade.php}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#8c52ff',
          secondary: '#ddd3f3',
          terciary: '#6425d8',
        },
      },
      fontFamily: {
        nimbus: ['"TAN Nimbus"', 'serif'],
        glacial: ['"Glacial Indifference"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}