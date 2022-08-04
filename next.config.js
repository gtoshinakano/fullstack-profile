const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  assetPrefix: isProd ? '/fullstack-profile/' : '',
  images: {
    loader: 'custom',
  },
}
