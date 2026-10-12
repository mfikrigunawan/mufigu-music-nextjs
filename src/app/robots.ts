import type { MetadataRoute } from 'next';

// Situs pribadi: minta semua crawler tidak mengindeks (link hanya dibagikan langsung).
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', disallow: '/' } };
}
