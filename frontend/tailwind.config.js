/** @type {import('tailwindcss').Config} */
export default {
	  corePlugins: {
    preflight: false,
  },
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

