// DATA PLAYLIST. Daftar lagu dibuat oleh `pnpm playlists` (scripts/build-playlists.mjs) dari folder musik
// dan disimpan di playlists.json; file MP3-nya sendiri tidak ada di Git (dilayani dari MUSIC_DIR lewat /media).
import data from './playlists.json';

export interface Track {
  /** Nama file di dalam folder playlist; juga menjadi id lagu */
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
  /** Nama subfolder di MUSIC_DIR */
  dir: string;
  tracks: Track[];
}

export const playlists = data as Playlist[];

export const getPlaylist = (slug: string) =>
  playlists.find((p) => p.slug === slug);

export const playlistDuration = (p: Playlist) =>
  p.tracks.reduce((sum, t) => sum + t.duration, 0);

export const trackUrl = (p: Playlist, t: Track) =>
  `/media/${p.slug}/${encodeURIComponent(t.file)}`;
