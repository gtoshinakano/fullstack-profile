const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  output: 'export',
  assetPrefix: isProd ? '/fullstack-profile/' : '',
  images: {
    loader: 'custom',
  },
}
