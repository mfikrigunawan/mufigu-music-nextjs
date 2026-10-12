import { playlists } from '@/content/playlists';

// Sampul playlist dibuat dari warna, bukan gambar: warna dipilih dari urutan playlist (tiga playlist pertama pasti berbeda).
const palette = [
  ['#7a9a8d', '#3f5c50'], // sage (aksen brand)
  ['#3a3a3a', '#0b0b0b'], // ink
  ['#cfae85', '#8f6b45'], // sand
  ['#86a0b6', '#465a6e'], // slate
  ['#c9917f', '#8a5444'], // clay
] as const;

export function coverColors(slug: string) {
  const i = Math.max(
    0,
    playlists.findIndex((p) => p.slug === slug),
  );
  return palette[i % palette.length];
}
