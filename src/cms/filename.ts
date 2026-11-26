// Membaca judul, artis, dan label dari nama file upload.
// Konvensi: "Artis---Judul.mp3" atau "Opening-1---Judul---Artis.mp3". Tanda "-" dibaca sebagai spasi.
const words = (s: string) => s.replace(/[-_]+/g, ' ').trim();
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export function parseFilename(file: string) {
  const parts = file.replace(/\.(mp3|mp4|m4a)$/i, '').split(/-{3,}/);
  const lead = parts[0].match(/^(Opening|Ending)-(\d+)$/i);
  if (lead && parts.length >= 3) {
    return {
      label: `${lead[1].toLowerCase() === 'opening' ? 'OP' : 'ED'} ${lead[2]}`,
      title: cap(words(parts[1])),
      artist: words(parts.slice(2).join(' ')),
    };
  }
  if (parts.length >= 2) {
    return {
      title: cap(words(parts.slice(1).join(' '))),
      artist: words(parts[0]),
    };
  }
  return { title: cap(words(parts[0])), artist: '' };
}
