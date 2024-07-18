/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lRed: '#e40428',
        lGrayDark: '#25303B',
        lGrayLight: '#39414C',
        lWhite: '#FFFFFF',
        rPrimary: "#72243D",
        rSecondary: "#EFEFEF",
        rYellow: "#F2A900"

      },
      fontFamily: {
        lIbmPlexMono: ['Myriad Pro', 'monospace'],
        lPublicSans: ['Myriad Pro'],
        lTekneLDO: ['Myriad Pro']
      }
    },
  },
  plugins: [],
}