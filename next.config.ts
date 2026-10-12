import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

// Semua aset (termasuk audio lewat /media) berasal dari domain sendiri, jadi CSP-nya ketat.
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' ${isDev ? `'unsafe-eval' ` : ''}`.trim(),
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob:`,
  `font-src 'self' data:`,
  `media-src 'self' blob:`,
  `connect-src 'self'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'self'`,
  ...(isDev ? [] : [`upgrade-insecure-requests`]),
].join('; ');

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false, // jangan membocorkan framework lewat header X-Powered-By
  output: 'standalone', // wajib untuk Dockerfile
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
