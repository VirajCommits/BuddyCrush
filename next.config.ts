// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'googleusercontent.com',
      'via.placeholder.com',
    ],
  },
  unoptimized: true,
  reactStrictMode: true,

  // Allows generating static HTML
  output: 'export',

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://pal-crush-2c20ca197e75.herokuapp.com/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
