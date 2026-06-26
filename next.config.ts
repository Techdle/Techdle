import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Clear-Site-Data",
            value: "\"cache\"",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
