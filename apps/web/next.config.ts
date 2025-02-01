import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [
      'assets.loket.com',
      'loket-production-sg.s3.ap-southeast-1.amazonaws.com'
    ], // Add the domain here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      }
    ]
  }
}

export default nextConfig
