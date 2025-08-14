/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force fresh build
  generateBuildId: () => 'build-' + Date.now(),
  // Disable static optimization to ensure dynamic rendering
  trailingSlash: false
}

module.exports = nextConfig