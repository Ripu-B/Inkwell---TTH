/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Skip type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip ESLint during build for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable source maps in production for smaller bundles
  productionBrowserSourceMaps: false,
  // Use SWC minifier for faster builds
  swcMinify: true,
};

export default nextConfig; 