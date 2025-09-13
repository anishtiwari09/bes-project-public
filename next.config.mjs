/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.js\.map$/,
      use: "ignore-loader",
    });
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
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

export default nextConfig;
