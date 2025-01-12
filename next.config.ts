// next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google profile picture domain
      'via.placeholder.com',       // Placeholder images
    ],
  },
  output: "export", // Required for static export
  reactStrictMode: true, // Enable strict mode
};

export default nextConfig;
