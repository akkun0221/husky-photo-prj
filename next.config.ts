import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-5d0311da2e0a4829b4043cf798f33881.r2.dev",
      },
    ],
  },
};

export default nextConfig;
