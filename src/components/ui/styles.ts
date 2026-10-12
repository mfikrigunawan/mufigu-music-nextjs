// Class Tailwind yang dipakai bersama banyak komponen. Class marker tanpa style (line__inner, section-title, section-title__ghost)
// dipertahankan karena dibaca GSAP (lihat components/motion/PageAnimations.tsx).

/** Judul besar dua baris (outline + solid). Susunan: h > span.line > span.line__inner.(outline|solid) */
// text-[ukuran] harus sebelum leading-*: tailwind-merge menganggap ukuran font menimpa line-height yang ada SEBELUMNYA
export const bigTitle =
  'mb-[clamp(1.5rem,3vw,3rem)] text-[length:var(--title-size)] leading-none tracking-[-.025em] uppercase';
export const bigLine = 'block overflow-hidden pb-[.06em]';
export const bigInner = 'line__inner block will-change-transform';
export const bigOutline =
  'big-title__outline font-semibold text-transparent [-webkit-text-stroke:1.5px_var(--ink)]';
export const bigSolid = 'font-extrabold text-black';

/** Judul section: teks outline samar di belakang, judul tebal di depan */
export const sectionTitle =
  'section-title relative mb-[clamp(1.25rem,2.5vw,2.5rem)] overflow-hidden pb-[.04em] text-[length:var(--title-size)] leading-none tracking-[-.025em] uppercase';
export const sectionGhost =
  'section-title__ghost ml-[.1em] block whitespace-nowrap font-semibold text-transparent [-webkit-text-stroke:1px_#d9d9d9] pointer-events-none select-none will-change-transform';
export const sectionMain =
  'relative z-1 -mt-[.62em] text-[length:inherit] font-extrabold leading-[1.1] text-black';

/** Paragraf pembuka */
export const lede =
  'text-[length:clamp(1.15rem,1.6vw,1.6rem)] leading-normal font-medium text-brand-primary';

/** Statistik angka besar */
export const statsGrid =
  'grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[clamp(1rem,2vw,2rem)] border-t border-brand-primary max640:grid-cols-[1fr]';
export const stat =
  'flex flex-col-reverse items-center gap-[.4rem] pt-[clamp(1.5rem,3vw,2.5rem)] text-center max640:not-last:border-b max640:not-last:border-line max640:not-last:pb-6';
export const statLabel =
  'text-[.8rem] font-medium tracking-[.08em] text-muted uppercase';
export const statValue =
  'text-[length:clamp(3rem,7vw,6.5rem)] leading-none font-extrabold tracking-[-.04em] text-black';

/** Hero halaman: blok teks di kiri */
export const heroSection =
  'relative overflow-hidden pt-[clamp(2rem,5vw,4.5rem)] pb-[clamp(1.5rem,3vw,3rem)]';
export const heroCopy =
  'relative grid max-w-[56rem] justify-items-start gap-5 [&>h1]:mb-0';

/** Header situs */
export const siteHeader =
  'fixed inset-x-0 top-0 z-60 h-(--header-h) border-b border-line bg-white [transition:background_.3s]';
export const siteHeaderInner =
  'site-header__inner wrap flex h-full items-center justify-between';
export const logoLink =
  'logo-link inline-flex items-center gap-3 text-brand-primary';
export const logoImg =
  'block aspect-[148/36] h-[1.9rem] w-auto max640:h-[1.6rem]';
