import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https' as const,
            hostname: 'res.cloudinary.com',
            pathname: '/dekzljlu0/image/upload/**',
          },
        ],
      },
    experimental: {
        serverActions: {
            bodySizeLimit: 100 * 1024 * 1024 * 1024, // 1000MB in bytes
        },
    },
};

export default withNextIntl(nextConfig); 
