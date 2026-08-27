const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')({})
  : (config) => config

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Allow importing MDX files
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // Image optimization
  images: {
    unoptimized: process.env.GITHUB_PAGES === 'true',
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'graph.microsoft.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              `default-src 'self'`,
              `script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-insights.com *.algolia.net`,
              `style-src 'self' 'unsafe-inline'`,
              `img-src 'self' blob: data: https:`,
              `font-src 'self' data:`,
              `connect-src 'self' *.algolia.net *.algolianet.com *.vercel-insights.com *.sentry.io`,
              `frame-src 'none'`,
              `object-src 'none'`,
              `base-uri 'self'`,
              `form-action 'self'`,
            ].join('; '),
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      { source: '/learn', destination: '/learn/paths', permanent: false },
    ]
  },

  // Webpack config
  webpack(config) {
    config.experiments = { ...config.experiments, asyncWebAssembly: true }
    return config
  },

  // Output strategy
  output: process.env.GITHUB_PAGES === 'true'
    ? 'export'
    : process.env.DOCKER_BUILD === 'true'
    ? 'standalone'
    : undefined,

  // Static generation needs more time for 800+ doc pages
  staticPageGenerationTimeout: 300,

  // Experimental features
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },

  // Environment variables exposed to browser
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
  },
}

module.exports = withBundleAnalyzer(nextConfig)
