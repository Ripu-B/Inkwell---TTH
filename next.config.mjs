/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // For GitHub Pages deployment
  basePath: process.env.NODE_ENV === 'production' ? '/Inkwell' : '',
  images: {
    unoptimized: true,
  },
  // Ensure lightningcss is properly loaded
  webpack: (config) => {
    // This is needed to make sure lightningcss binaries are properly loaded
    // in different environments including CI/CD
    config.resolve.alias = {
      ...config.resolve.alias,
      lightningcss: require.resolve('lightningcss'),
    };
    return config;
  },
};

export default nextConfig; 