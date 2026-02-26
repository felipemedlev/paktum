import createNextIntlPlugin from 'next-intl/plugin';

// next-intl v4: point to the request config file
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdf-parse', 'tesseract.js', 'mammoth', '@napi-rs/canvas'],
  experimental: {
    serverActions: {
      bodySizeLimit: '30mb',
    },
  },
};

export default withNextIntl(nextConfig);
