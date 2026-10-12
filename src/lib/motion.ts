import { gsap } from '@/lib/gsap';

// Pengaturan kecepatan animasi teks. Ubah angka di sini untuk mempercepat/memperlambat semua halaman sekaligus.
export const motion = {
  /** Reveal judul besar (durasi dan jeda antar baris), detik */
  title: { duration: 1.7, stagger: 0.2 },
  /** Teks hero yang muncul berurutan (data-ap="fade") dan blok yang muncul saat di-scroll (data-reveal) */
  fade: { duration: 1.3, stagger: 0.2 },
  reveal: { duration: 1.3, stagger: 0.16 },
  /** Teks outline raksasa: masuk (detik) */
  ghost: { duration: 1.8, heroDuration: 2.1 },
  /** Angka statistik menghitung naik, detik */
  count: 2.6,
  /** Teks berjalan (marquee): pixel yang digeser untuk setiap 1px scroll. Makin kecil makin pelan. */
  marqueeSpeed: 1.5,
  /** Kehalusan animasi yang mengikuti scroll: makin besar makin "menyusul" dengan lembut, detik */
  scrub: 1.4,
} as const;

/**
 * Teks yang berjalan menyamping mengikuti scroll, dengan kecepatan tetap (motion.marqueeSpeed px per px scroll),
 * tidak bergantung pada panjang barisnya.
 */
export function marquee(
  row: HTMLElement,
  trigger: Element | null,
  left: boolean,
  start = 'top bottom',
  end = 'bottom top',
) {
  const distance = () => {
    const range =
      window.innerHeight + (trigger?.getBoundingClientRect().height ?? 0);
    return Math.min(range * motion.marqueeSpeed, row.scrollWidth * 0.33); // jangan melewati ujung baris
  };
  gsap.fromTo(
    row,
    { x: () => (left ? 0 : -distance()) },
    {
      x: () => (left ? -distance() : 0),
      ease: 'none',
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub: motion.scrub,
        invalidateOnRefresh: true,
      },
    },
  );
}
