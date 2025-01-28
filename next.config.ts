import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vgw57je9hq.ufs.sh",
        pathname: "/f/*",
      },
    ],
  },
};

export default nextConfig;