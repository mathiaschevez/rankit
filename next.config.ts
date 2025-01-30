import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'utfs.io' },
      { hostname: 'vgw57je9hq.ufs.sh'}
    ],
  },
};

export default nextConfig;