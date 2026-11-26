// Tipe dan helper playlist (aman untuk client). Datanya berasal dari CMS, lihat content/cms.ts.

export interface Track {
  /** Nama file upload; juga menjadi id lagu */
  file: string;
  title: string;
  artist: string;
  /** Penanda seperti "OP 1" / "ED 7" (hanya playlist anime) */
  label?: string;
  /** Detik */
  duration: number;
}

export interface Playlist {
  slug: string;
  name: string;
  /** Urutan di beranda; menentukan warna sampul */
  color: number;
  tracks: Track[];
}

export const playlistDuration = (p: Playlist) =>
  p.tracks.reduce((sum, t) => sum + t.duration, 0);

export const trackUrl = (t: Track) => `/media/${encodeURIComponent(t.file)}`;
