const isProd = process.env.NODE_ENV === 'production'
const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ja", "pt-BR"],
    localePath: isProd ? path.resolve('./public/locales') : "./public/locales"
  }
}