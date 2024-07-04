/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";
export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {colors:{
      golden:"#F6F3CC",
      themeBlue:"#091F5B",
      background:"#EEEFF3",
      wts:'#ECE5DD',
      glass: 'rgba(255, 255, 255, 0.5)',
    }},
  },
  plugins: [],
})