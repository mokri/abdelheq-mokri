import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["shiki"],
  experimental: {
    // The project lives on an exFAT drive, where macOS writes "._*" files next to
    // Turbopack's on-disk cache and corrupts it ("Failed to open database").
    turbopackFileSystemCacheForDev: false,
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
