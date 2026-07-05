/** @type {import('next').NextConfig} */
import bundleAnalyzer from "@next/bundle-analyzer";
import withSerwistInit from "@serwist/next";

const isProduction = process.env.NODE_ENV === "production";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withSerwist = withSerwistInit({
  swSrc: "sw.ts",
  swDest: "public/sw.js",
  disable: !isProduction,
});

const nextConfig = withSerwist({
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      {
        protocol: "https",
        hostname: "assets.ctfassets.net",
      },
    ],
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.js\.map$/,
      use: "ignore-loader",
    });
    return config;
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://app.contentful.com",
          },
        ],
      },
      {
        source: "/images/:all*.pdf",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
      {
        source: "/images/:all*(jpg|jpeg|png|gif|webp|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  generateBuildId: async () => {
    return String(Date.now());
  },
});

export default withBundleAnalyzer(nextConfig);
