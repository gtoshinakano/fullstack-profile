const isProd = process.env.NODE_ENV === 'production'
const withNextOptimizedImages = require('next-optimized-images');

module.exports = withNextOptimizedImages({
  assetPrefix: isProd ? '/uiux-profile/' : '',
})