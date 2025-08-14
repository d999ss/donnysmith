/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force fresh build
  generateBuildId: () => 'build-' + Date.now(),
  // Ensure proper static file handling
  trailingSlash: false,
  // Output directory settings
  distDir: '.next',
  // Ensure public directory is recognized
  assetPrefix: ''
}

module.exports = nextConfig