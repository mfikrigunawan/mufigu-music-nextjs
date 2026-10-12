import type Lenis from 'lenis';

// Instance Lenis dipakai bersama oleh Header, SearchDialog, dan anchor scroll.
export const lenisRef: { current: Lenis | null } = { current: null };

export function stopScroll() {
  if (lenisRef.current) lenisRef.current.stop();
  else document.body.style.overflow = 'hidden';
}

export function startScroll() {
  if (lenisRef.current) lenisRef.current.start();
  else document.body.style.overflow = '';
}

export function scrollToTarget(target: HTMLElement | number, offset = 0) {
  const lenis = lenisRef.current;
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4 });
    return;
  }
  const top =
    typeof target === 'number'
      ? target
      : target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({
    top,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth',
  });
}
