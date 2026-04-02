import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "googleusercontent.com",
      "via.placeholder.com",
    ],
    unoptimized: true,
  },
  reactStrictMode: true,
  output: "export",
};

export default nextConfig;
