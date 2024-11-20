/** @type {import('next').NextConfig} */

const NEXT_PUBLIC_MAILER_URI = process.env.NEXT_PUBLIC_MAILER_URI;

module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "tfhe_bg.wasm": require.resolve("tfhe/tfhe_bg.wasm"),
    };
    return config;
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${NEXT_PUBLIC_MAILER_URI}/:path*`,
      },
    ];
  },
};
