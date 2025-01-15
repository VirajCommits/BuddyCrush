/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'googleusercontent.com',
      'via.placeholder.com',
    ],
  },
  reactStrictMode: true,

  // 1) Add the async rewrites() function below
  async rewrites() {
    return [
      {
        // 2) All requests to /api/... on the FE
        //    should be sent to your BE app
        source: '/api/:path*',
        // destination: 'https://buddy-board-88fd54c902d8.herokuapp.com/api/:path*',
        destination: 'http://127.0.0.1:5000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
