/** @type {import('next').NextConfig} */
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
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

  // 👇 Custom caching headers
  async headers() {
    return [
      // Do NOT cache PDFs inside /images
      {
        source: "/images/:all*.pdf",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
      // Cache images aggressively (1 year, immutable)
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

  // 👇 Ensure new buildId on every deployment
  generateBuildId: async () => {
    return String(Date.now()); // Or use commit SHA if on CI/CD
  },
};

export default withBundleAnalyzer(nextConfig);
