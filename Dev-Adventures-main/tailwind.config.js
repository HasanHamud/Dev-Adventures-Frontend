/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      listStyleImage: {
        checkmark: 'url("/img/checkmark.png")',
      },

    },
  },
  plugins: [],
}

