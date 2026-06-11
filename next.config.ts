import type { NextConfig } from "next";

// Security headers applied to every response (secure-by-default).
// Tighten the CSP per project once you know which third-party origins you use.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js inlines a small runtime script; Vercel Analytics/Speed Insights load from the same origin via the rewrite below.
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (avoids picking up a stray parent lockfile).
  turbopack: { root: import.meta.dirname },
  // Next.js 16 explicit caching model: nothing is cached unless marked with 'use cache'.
  cacheComponents: true,
  // React Compiler (requires babel-plugin-react-compiler): automatic memoisation.
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // v16 requires an explicit qualities allowlist.
    qualities: [50, 75, 90],
    // Add the CDNs/hostnames you actually load remote images from; keep these tight.
    remotePatterns: [
      // { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
