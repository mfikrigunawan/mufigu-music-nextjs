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
  /** Kehalusan animasi yang mengikuti scroll: makin besar makin "menyusul" dengan lembut, detik */
  scrub: 1.4,
} as const;
