import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // kv.ee listing photos (img-kv.ee is a separate domain, not a subdomain)
      { protocol: "https", hostname: "img-kv.ee" },
      { protocol: "https", hostname: "*.kv.ee" },
      { protocol: "https", hostname: "kv.ee" },
    ],
  },
};

export default nextConfig;
