/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-385a99dd700a4d468b195ab2a2b2b555.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
