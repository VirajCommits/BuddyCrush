import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Proxy API + Socket.IO to Flask during local dev (browser stays on :3000)
    if (process.env.NODE_ENV === "development") {
      const backend = process.env.BACKEND_URL || "http://127.0.0.1:5000";
      return [
        { source: "/api/:path*", destination: `${backend}/api/:path*` },
        { source: "/socket.io/:path*", destination: `${backend}/socket.io/:path*` },
      ];
    }
    return [];
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "googleusercontent.com",
      "via.placeholder.com",
    ],
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
