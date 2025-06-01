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
};

export default withNextIntl(nextConfig);
