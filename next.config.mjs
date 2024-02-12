/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({ canvas: 'commonjs canvas' })

    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'liveblocks.io',
      },
    ],
  },
}

export default nextConfig
