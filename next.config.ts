import type { NextConfig } from "next";

const nextConfig: NextConfig = { devIndicators: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  reactStrictMode: true,
  allowedDevOrigins: ['100.67.165.3'],
};

module.exports = nextConfig
