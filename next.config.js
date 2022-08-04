const isProd = process.env.NODE_ENV === 'production'
const { i18n } = require("./i18n.config");

module.exports = {
  assetPrefix: isProd ? '/fullstack-profile/' : '',
  images: {
    loader: 'custom',
  },
  i18n
}
