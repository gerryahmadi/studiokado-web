import type { NextConfig } from "next";

// Laravel backend (see src/lib/api.ts). Product images are served from its /uploads.
const laravelUrl = new URL(process.env.LARAVEL_URL ?? "http://127.0.0.1:8005");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: laravelUrl.protocol.replace(":", "") as "http" | "https",
        hostname: laravelUrl.hostname,
        port: laravelUrl.port,
        pathname: "/**",
      },
      // Merchandise photos (Spatie media library on the S3-compatible bucket, Laravel MEDIA_DISK=s3).
      { protocol: "https", hostname: "is3.cloudhost.id", pathname: "/studiokado/**" },
    ],
    // Local dev serves Laravel from 127.0.0.1, which the image optimizer blocks by default.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
  async redirects() {
    // Product detail and Quick Hampers moved to Laravel's paths (/p/:slug, /quick-hampers).
    return [
      { source: "/products/shop/:slug", destination: "/quick-hampers", permanent: true },
      { source: "/products/:slug", destination: "/p/:slug", permanent: true },
      // Personal inquiry form renamed (Framer path /form-inquiry-personal).
      { source: "/form-inquiry-personal/:path*", destination: "/inquiry-form", permanent: true },
      // The single sample project page became one page per project.
      { source: "/corporate-gift/detail", destination: "/corporate-gift/projects", permanent: false },
      // Create Hampers has no index page; the flow starts at the box step.
      { source: "/create-hampers", destination: "/create-hampers/package", permanent: false },
    ];
  },
};

export default nextConfig;
