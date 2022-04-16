module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontSize: {
        '16xl': '12rem',
        '24xl': '18rem',
      },
      transitionProperty: {
        height: 'height',
        maxHeight: 'max-height',
      },
      colors: {
        heroGray: "#001424",
        primary: "#D90368",
        secondary: "#EF8354",
        ternary: "#2B303F",
        figmaBlue: "#54CAEF"
      },
      maxWidth: {
        'xl-screen': '1728px'
      }
    },
    fontFamily: {
      bigNoodle: ['"big-noodle"', 'Helvetica'],
      morganite: ['"morganite"', 'Helvetica'],
      sourceSerif: ['"Source Serif Pro"'],
      openSans: ['"Open Sans"'],
      wask: ['wask_new'],
      poppins: ['Poppins'],
      forum: ['Forum'],
      futura: ['futura'],
      pacifico: ['Pacifico'],
      trueno: ['Trueno'],
    },
  }
}
