import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.1.2'],
};

export default nextConfig;
