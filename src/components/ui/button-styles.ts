import { cva } from 'class-variance-authority';

// Gaya tombol (tanpa JavaScript, aman dipakai di server component).
//
// Hover: tombol naik sedikit (-translate-y) DAN warna isi "berjalan" memenuhi tombol. Isi (::before) berbentuk pil yang sama dengan
// tombol, jadi sisi depannya membulat; overflow-hidden memotongnya di dalam tombol. Teks dan ikon panah (currentColor) ikut berganti warna.
//
// Arah gerak isi diatur atribut data-fill (diisi oleh komponen Button di Button.tsx lewat mouseenter/mouseleave):
//   idle = menunggu di sisi kiri, tanpa transisi
//   in   = masuk dari kiri sampai menutupi tombol
//   out  = keluar lewat sisi kanan; setelah selesai kembali ke idle (loncat ke kiri tanpa transisi)
// Warna isi diatur per variant lewat before:bg-*, warna teks saat isi masuk lewat data-[fill=in]:text-*.
export const button = cva(
  [
    'relative isolate inline-flex items-center justify-center justify-self-start overflow-hidden rounded-[999px] capitalize',
    'border-[1.5px] border-brand-primary px-[1.9rem] py-[.85rem] text-[.95rem] font-semibold',
    'hover:-translate-y-0.5 disabled:pointer-events-none',
    // teks: warna ikut berubah bersamaan dengan tepi isi yang lewat di atasnya (masuk .4s, keluar .25s)
    '[transition:translate_.25s,color_.25s_var(--ease-soft),background-color_.45s,border-color_.45s] data-[fill=in]:[transition:translate_.25s,color_.4s_var(--ease-soft),background-color_.45s,border-color_.45s]',
    'before:absolute before:inset-0 before:-z-10 before:-translate-x-[105%] before:rounded-[999px] before:content-[""]',
    'data-[fill=in]:before:translate-x-0 data-[fill=in]:before:[transition:translate_.55s_var(--ease-soft)]',
    'data-[fill=out]:before:translate-x-[105%] data-[fill=out]:before:[transition:translate_.55s_var(--ease-soft)]',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'bg-brand-primary text-white before:bg-white data-[fill=in]:text-[#222]',
        ghost:
          'bg-transparent text-brand-primary before:bg-brand-primary data-[fill=in]:text-white',
      },
      // `more` = tombol dengan ikon panah yang bergeser saat hover
      more: {
        true: 'gap-[.6rem] [&_svg]:h-[1.15rem] [&_svg]:w-[1.15rem] [&_svg]:transition-transform [&_svg]:duration-250 hover:[&_svg]:translate-x-1',
        false: '',
      },
    },
    defaultVariants: { variant: 'primary', more: false },
  },
);
