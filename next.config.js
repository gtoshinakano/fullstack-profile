const isProd = process.env.NODE_ENV === 'production'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/fullstack-profile'

module.exports = {
  output: 'export',
  assetPrefix: isProd ? `${basePath}/` : '',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    loader: 'custom',
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    })
    return config
  },
}
