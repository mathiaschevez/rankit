import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'utfs.io'},
      { hostname: 'vgw57je9hq.ufs.sh'},
      { hostname: 'img.clerk.com' }
    ],
  },
};

export default nextConfig;