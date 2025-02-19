/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  devIndicators: {
    appIsrStatus: true,
  },
};

export default nextConfig;
