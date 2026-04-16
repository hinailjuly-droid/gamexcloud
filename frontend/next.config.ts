import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'opengraph.githubassets.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.htmlgames.com',
      },
      {
        protocol: 'https',
        hostname: 'www.htmlgames.com',
      },
    ],
  },
};

export default nextConfig;
