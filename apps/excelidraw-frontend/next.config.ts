import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Rewrites for local development (in production, Nginx handles this)
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3002/:path*",
      },
      {
        source: "/ml-api/:path*",
        destination: "http://localhost:3003/:path*",
      },
    ];
  },
};

export default nextConfig;
