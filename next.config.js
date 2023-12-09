/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['imgix.cosmicjs.com', 'cosmic-s3.imgix.net', 'lh3.googleusercontent.com', 'www.gravatar.com', 'gravatar.com', 'cdn.cosmicjs.com'],
  },
  webpack: (originalConfig, { isServer }) => {
    const config = { ...originalConfig }; // Clone the originalConfig into a new object
    if (!isServer) {
      config.experiments = { topLevelAwait: true };
    }
    return config;
  },
};

module.exports = nextConfig;
