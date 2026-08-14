/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // ensure compatibility for custom file uploads
  },
  async redirects() {
    return [
      // Canonical WWW redirect logic handled at server edge or middleware level
    ];
  },
};

module.exports = nextConfig;
