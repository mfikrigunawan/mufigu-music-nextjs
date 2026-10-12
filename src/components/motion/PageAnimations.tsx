'use client';

import { motion, marquee } from '@/lib/motion';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

let introPlayed = false; // intro header hanya sekali per kunjungan

/**
 * Seluruh animasi GSAP + ScrollTrigger halaman, dikendalikan lewat atribut data-*:
 * data-intro (hero), data-title (judul besar), data-reveal (kartu/blok), data-row (baris lagu),
 * data-marquee (teks berjalan mengikuti scroll), dan .section-title__ghost.
 * Pasang <PageAnimations /> sekali di setiap halaman yang memakai atribut tersebut.
 */
export function PageAnimations() {
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // semua konten tetap tampil

    try {
      const $$ = <T extends Element = HTMLElement>(
        sel: string,
        ctx: ParentNode = document,
      ) => Array.from(ctx.querySelectorAll<T>(sel));

      // Intro
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (!introPlayed) {
        introPlayed = true;
        tl.from('.site-header__inner > *', {
          y: -18,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          clearProps: 'transform,opacity',
        });
      }
      if ($$('[data-intro]').length) {
        tl.fromTo(
          '[data-intro]',
          { y: 70, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.05,
            stagger: 0.12,
            clearProps: 'transform',
          },
          0.25,
        );
      }

      // Judul besar: reveal baris bermask (autoAlpha agar tidak bentrok dengan CSS awal)
      $$('[data-title]').forEach((t) => {
        gsap.fromTo(
          $$('.line__inner', t),
          { yPercent: 112, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: motion.title.duration,
            ease: 'power4.out',
            stagger: motion.title.stagger,
            scrollTrigger: { trigger: t, start: 'top 88%', once: true },
          },
        );
      });

      // Teks ghost judul section: muncul + bergerak horizontal saat scroll
      $$('.section-title__ghost').forEach((g) => {
        const wrap = g.closest('.section-title');
        const small = window.innerWidth < 700;
        gsap.fromTo(
          g,
          { opacity: 0, xPercent: -5 },
          {
            opacity: 1,
            xPercent: 0,
            duration: motion.ghost.duration,
            ease: 'power3.out',
            scrollTrigger: { trigger: wrap, start: 'top 88%', once: true },
          },
        );
        gsap.fromTo(
          g,
          { x: 0 },
          {
            x: small ? 18 : 60,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top bottom',
              end: 'bottom top',
              scrub: motion.scrub,
            },
          },
        );
      });

      // Teks berjalan mengikuti scroll
      $$('[data-marquee]').forEach((row, i) =>
        marquee(row, row.closest('[data-marquee-wrap]'), i % 2 === 0),
      );

      // Kartu/blok muncul berkelompok
      if ($$('[data-reveal]').length)
        ScrollTrigger.batch('[data-reveal]', {
          start: 'top 90%',
          once: true,
          onEnter: (els) =>
            gsap.fromTo(
              els,
              { y: 50, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: motion.reveal.duration,
                ease: 'power3.out',
                stagger: motion.reveal.stagger,
                overwrite: true,
                clearProps: 'transform',
              },
            ),
        });

      // Baris lagu: lebih pendek dan rapat daripada kartu
      if ($$('[data-row]').length)
        ScrollTrigger.batch('[data-row]', {
          start: 'top 95%',
          once: true,
          onEnter: (els) =>
            gsap.fromTo(
              els,
              { y: 24, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.05,
                overwrite: true,
                clearProps: 'transform',
              },
            ),
        });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    } catch (err) {
      console.error('Animation setup failed:', err);
      document.documentElement.classList.remove('js'); // pastikan konten tidak tersembunyi
    }
  }, []);

  return null;
}
