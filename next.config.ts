import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export" eemaldatud — Sanity Studio ja API routes vajavad server-side renderingut
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img-kv.ee" },
      { protocol: "https", hostname: "*.kv.ee" },
      { protocol: "https", hostname: "kv.ee" },
      // Sanity CDN
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
