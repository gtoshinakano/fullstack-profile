const isProd = process.env.NODE_ENV === 'production'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/fullstack-profile'

module.exports = {
  output: 'export',
  assetPrefix: isProd ? `${basePath}/` : '',
  images: {
    loader: 'custom',
  },
}
