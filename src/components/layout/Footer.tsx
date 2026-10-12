import { siteConfig } from '@/config/site.config';

export function Footer() {
  return (
    <footer className="mt-[clamp(3rem,7vw,7rem)] border-t border-line py-8 text-[.85rem] text-muted">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p>
          © {new Date().getFullYear()}{' '}
          <a
            className="font-medium text-brand-primary underline underline-offset-[3px]"
            href={siteConfig.parentUrl}
          >
            Mufigu
          </a>{' '}
          · A personal music player and a case study.
        </p>
        <p>Next.js · Tailwind CSS · GSAP · Lenis</p>
      </div>
    </footer>
  );
}
