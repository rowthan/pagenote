/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  assetPrefix: process.env.prefix || undefined,
  // 传递给前端的变量（不指定的参数，前端代码无法获取，仅服务端代码可读）
  env: {
    prefix: process.env.prefix || '',
    WEB_HOST: process.env.WEB_HOST || '',
    API_HOST: process.env.API_HOST || '',
  },
  async rewrites() {
    return [
      {
        source: '/:path*.html',
        destination: '/:path*',
      },
      {
        source: '/pro',
        destination: '/widget/pro-plan',
      },
      {
        source: '/vip',
        destination: '/widget/pro-plan',
      },
      {
        source: '/pricing',
        destination: '/widget/pro-plan',
      },
    ]
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pagenote.cn',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    // ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    }) // 针对 SVG 的处理规则

    config.externals.push({
      'ali-oss': 'umd OSS',
      'react':'React',
      'react-dom': 'ReactDOM',
    })

    return config
  },
}
