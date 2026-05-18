import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingIncludes: {
    '/**': ['./node_modules/.prisma/client/**'],
  },
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-mariadb', 'mariadb'],
  allowedDevOrigins: ['*.ngrok-free.dev', '*.ngrok-free.app'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
  },
}

export default nextConfig
