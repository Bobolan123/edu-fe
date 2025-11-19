import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone' as const,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https' as const,
            hostname: 'res.cloudinary.com',
            pathname: '/dekzljlu0/image/upload/**',
          },
          {
            protocol: 'https' as const,
            hostname: 'images.unsplash.com',
          },
          {
            protocol: 'https' as const,
            hostname: 'i.pravatar.cc',
          },
        ],
      },
    experimental: {
        authInterrupts: true,
        serverActions: {
            bodySizeLimit: 100 * 1024 * 1024 * 1024, // 1000MB in bytes
        },
    },
};

export default withNextIntl(nextConfig); 
