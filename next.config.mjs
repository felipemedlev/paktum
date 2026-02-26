import createNextIntlPlugin from 'next-intl/plugin';

// next-intl v4: point to the request config file
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly set the src directory
  distDir: '.next',
};

export default withNextIntl(nextConfig);
