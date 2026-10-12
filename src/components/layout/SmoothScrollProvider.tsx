'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { lenisRef, scrollToTarget } from '@/lib/lenis';

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    let tick: ((time: number) => void) | null = null;
    let lenis: Lenis | null = null;

    if (!reduce) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      const l = lenis;
      tick = (time: number) => l.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // Anchor scroll halus untuk link "#..." (mis. tombol "Browse playlists").
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const a = (e.target as Element).closest('a');
      const href = a?.getAttribute('href') ?? '';
      if (!a || !href.startsWith('#') || href.length < 2) return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      scrollToTarget(
        target,
        -(
          (document.querySelector<HTMLElement>('[data-header]')?.offsetHeight ??
            64) + 12
        ),
      );
      window.history.pushState(null, '', href);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
