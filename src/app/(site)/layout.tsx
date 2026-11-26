import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider';
import { PlayerBar } from '@/components/player/PlayerBar';
import { siteConfig } from '@/config/site.config';
import { getLibrary, getSite } from '@/content/cms';
import '../globals.css';

// Font di-host sendiri (src/fonts), tanpa request ke Google Fonts.
const poppins = localFont({
  src: [
    {
      path: '../../fonts/poppins-latin-300-normal.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../fonts/poppins-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../fonts/poppins-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../fonts/poppins-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../fonts/poppins-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../fonts/poppins-latin-800-normal.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-poppins',
  display: 'swap',
});

// Konten diambil dari CMS di setiap request, jadi perubahan di CMS langsung tampil.
export const dynamic = 'force-dynamic';

// Situs pribadi dan case study: tidak perlu SEO, justru jangan diindeks (lihat juga robots.ts).
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const name = site.name || siteConfig.name;
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: name, template: `%s · ${name}` },
    description: site.description,
    robots: { index: false, follow: false },
    icons: { icon: '/favicon.svg' },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // area aman iPhone: player memakai env(safe-area-inset-bottom)
  themeColor: siteConfig.brandColor.primary,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [site, playlists] = await Promise.all([getSite(), getLibrary()]);
  const brandVars = {
    '--brand-primary': siteConfig.brandColor.primary,
    '--brand-accent': siteConfig.brandColor.accent,
  } as React.CSSProperties;

  return (
    // suppressHydrationWarning: class "js" ditambahkan oleh skrip kecil di <head> sebelum React hydrate
    <html
      lang="en"
      className={poppins.variable}
      style={brandVars}
      suppressHydrationWarning
    >
      <head>
        <Script id="js-flag" strategy="beforeInteractive">
          {"document.documentElement.classList.add('js')"}
        </Script>
      </head>
      <body id="top" className="font-sans antialiased">
        <a
          className="fixed top-[-4rem] left-4 z-200 rounded-lg bg-brand-primary px-[1.1rem] py-[.7rem] text-white [transition:top_.2s] focus:top-4"
          href="#main"
        >
          {site.skipLink}
        </a>
        <SmoothScrollProvider>
          <Header
            name={site.name || siteConfig.name}
            wordmark={site.headerWordmark}
            linkLabel={site.headerLinkLabel}
            linkUrl={site.headerLinkUrl}
          />
          {/* padding bawah = tinggi player (fixed) supaya footer tidak tertutup */}
          <div className="pb-[calc(var(--player-h)+env(safe-area-inset-bottom))]">
            <main id="main" className="pt-(--header-h)">
              {children}
            </main>
            <Footer
              linkLabel={site.footerLinkLabel}
              linkUrl={site.footerLinkUrl}
              text={site.footerText}
            />
          </div>
          <PlayerBar
            playlists={playlists}
            texts={{
              empty: site.playerEmpty,
              hint: site.playerHint,
              error: site.playerError,
            }}
          />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
