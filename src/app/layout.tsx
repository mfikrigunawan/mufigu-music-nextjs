import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider';
import { PlayerBar } from '@/components/player/PlayerBar';
import { siteConfig } from '@/config/site.config';
import './globals.css';

// Font di-host sendiri (src/fonts), tanpa request ke Google Fonts.
const poppins = localFont({
  src: [
    {
      path: '../fonts/poppins-latin-300-normal.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/poppins-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/poppins-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/poppins-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/poppins-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/poppins-latin-800-normal.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-poppins',
  display: 'swap',
});

// Situs pribadi dan case study: tidak perlu SEO, justru jangan diindeks (lihat juga robots.ts).
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // area aman iPhone: player memakai env(safe-area-inset-bottom)
  themeColor: siteConfig.brandColor.primary,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          Skip to content
        </a>
        <SmoothScrollProvider>
          <Header />
          {/* padding bawah = tinggi player (fixed) supaya footer tidak tertutup */}
          <div className="pb-[calc(var(--player-h)+env(safe-area-inset-bottom))]">
            <main id="main" className="pt-(--header-h)">
              {children}
            </main>
            <Footer />
          </div>
          <PlayerBar />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
