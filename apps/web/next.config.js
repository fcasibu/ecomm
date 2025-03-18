import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';
import { fileURLToPath } from 'node:url';
import withBundleAnalyzer from '@next/bundle-analyzer';
import createJiti from 'jiti';
const jiti = createJiti(fileURLToPath(import.meta.url));

jiti.import('./src/env/client.ts');
jiti.import('./src/env/server.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    inlineCss: true,
    ppr: true,
    reactCompiler: true,
    useCache: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: '*.cloudinary.com',
      },
    ],
    dangerouslyAllowSVG: true,
  },
  serverExternalPackages: ['pino', 'cloudinary'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
};

// eslint-disable-next-line turbo/no-undeclared-env-vars, no-undef
export default withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(
  nextConfig,
);
