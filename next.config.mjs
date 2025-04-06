/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.js\.map$/,
      use: 'ignore-loader',
    });
    return config;
  },
  experimental: {
    // 👇 Add this part to make puppeteer-core & chromium work in serverless (Vercel)
    serverComponentsExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
  },
};

export default nextConfig;
