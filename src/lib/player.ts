// PEMUTAR AUDIO. Satu elemen <audio> dan satu store di luar React, jadi musik terus jalan saat pindah halaman
// dan tidak ada state yang basi di dalam event handler. Komponen membaca lewat hook di bawah (useSyncExternalStore).
// Hanya boleh dipanggil dari komponen client.
import { useSyncExternalStore } from 'react';
import {
  getPlaylist,
  trackUrl,
  type Playlist,
  type Track,
} from '@/content/playlists';

export type Repeat = 'off' | 'all' | 'one';

export interface PlayerState {
  /** Playlist yang sedang jadi antrean */
  slug: string | null;
  /** Urutan putar: indeks lagu di playlist (diacak bila shuffle) */
  order: number[];
  /** Posisi lagu sekarang di dalam `order` */
  pos: number;
  playing: boolean;
  shuffle: boolean;
  repeat: Repeat;
  volume: number;
  muted: boolean;
  /** File gagal dimuat */
  error: boolean;
}

export interface TimeState {
  current: number;
  duration: number;
}

const initial: PlayerState = {
  slug: null,
  order: [],
  pos: 0,
  playing: false,
  shuffle: false,
  repeat: 'off',
  volume: 1,
  muted: false,
  error: false,
};
const zeroTime: TimeState = { current: 0, duration: 0 };
const STORAGE_KEY = 'mufigu-music:v1';

let state = initial;
let time = zeroTime;
let audio: HTMLAudioElement | null = null;
const stateListeners = new Set<() => void>();
const timeListeners = new Set<() => void>();

const subscribeState = (l: () => void) => (
  stateListeners.add(l),
  () => void stateListeners.delete(l)
);
const subscribeTime = (l: () => void) => (
  timeListeners.add(l),
  () => void timeListeners.delete(l)
);

export const usePlayerState = () =>
  useSyncExternalStore(
    subscribeState,
    () => state,
    () => initial,
  );
export const usePlayerTime = () =>
  useSyncExternalStore(
    subscribeTime,
    () => time,
    () => zeroTime,
  );

export function currentOf(
  s: PlayerState,
): { playlist: Playlist; track: Track; index: number } | null {
  const playlist = s.slug ? getPlaylist(s.slug) : undefined;
  const index = s.order[s.pos];
  const track = playlist?.tracks[index];
  return playlist && track ? { playlist, track, index } : null;
}

function set(patch: Partial<PlayerState>) {
  state = { ...state, ...patch };
  stateListeners.forEach((l) => l());
  persist();
}

function setTime(current: number, duration?: number) {
  const known =
    audio && Number.isFinite(audio.duration) && audio.duration > 0
      ? audio.duration
      : null;
  time = {
    current,
    duration: duration ?? known ?? currentOf(state)?.track.duration ?? 0,
  };
  timeListeners.forEach((l) => l());
}

function persist() {
  try {
    const c = currentOf(state);
    const { volume, muted, shuffle, repeat } = state;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        volume,
        muted,
        shuffle,
        repeat,
        slug: c?.playlist.slug,
        file: c?.track.file,
      }),
    );
  } catch {
    // penyimpanan diblokir (mode privat): abaikan
  }
}

function natural(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}

/** Urutan acak dengan `first` di depan */
function shuffled(n: number, first: number) {
  const rest = natural(n).filter((i) => i !== first);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [first, ...rest];
}

function build(n: number, first: number, shuffle: boolean) {
  return shuffle
    ? { order: shuffled(n, first), pos: 0 }
    : { order: natural(n), pos: first };
}

function load(slug: string, order: number[], pos: number, autoplay: boolean) {
  const playlist = getPlaylist(slug);
  const track = playlist?.tracks[order[pos]];
  if (!audio || !playlist || !track) return;
  audio.src = trackUrl(playlist, track);
  set({ slug, order, pos, error: false });
  setTime(0, track.duration);
  syncMediaSession();
  if (autoplay) play();
}

function play() {
  audio?.play().catch((e: unknown) => {
    // AbortError = pemutaran diganti lagu lain sebelum sempat mulai; bukan kegagalan
    if ((e as DOMException).name !== 'AbortError')
      set({ playing: false, error: true });
  });
}

// ---------- Aksi (dipanggil dari UI) ----------

/** Putar `index` dari playlist `slug`. `shuffle` mengubah mode acak; kosong = pakai mode sekarang. */
export function playPlaylist(slug: string, index = 0, shuffle = state.shuffle) {
  const playlist = getPlaylist(slug);
  if (!playlist) return;
  const { order, pos } = build(playlist.tracks.length, index, shuffle);
  if (shuffle !== state.shuffle) set({ shuffle });
  load(slug, order, pos, true);
}

/** Klik sebuah lagu: lagu yang sedang aktif hanya di-toggle, lagu lain mulai diputar. */
export function playTrack(slug: string, index: number) {
  const c = currentOf(state);
  if (c && c.playlist.slug === slug && c.index === index) toggle();
  else playPlaylist(slug, index);
}

export function toggle() {
  if (!audio || !state.slug) return;
  if (audio.paused) play();
  else audio.pause();
}

export function next() {
  const { slug, order, pos, shuffle } = state;
  const playlist = slug ? getPlaylist(slug) : undefined;
  if (!slug || !playlist) return;
  if (pos + 1 < order.length) load(slug, order, pos + 1, true);
  else {
    const b = build(playlist.tracks.length, 0, shuffle); // sampai akhir: ulang dari awal (acak ulang bila shuffle)
    load(slug, b.order, b.pos, true);
  }
}

export function prev() {
  if (!audio || !state.slug) return;
  if (audio.currentTime > 3 || state.pos === 0) {
    audio.currentTime = 0;
    setTime(0);
  } else load(state.slug, state.order, state.pos - 1, true);
}

export function seek(seconds: number) {
  if (!audio) return;
  const max = time.duration || audio.duration || 0;
  audio.currentTime = Math.min(Math.max(0, seconds), max || seconds);
  setTime(audio.currentTime);
}

export function seekBy(delta: number) {
  if (audio) seek(audio.currentTime + delta);
}

export function setVolume(volume: number) {
  if (!audio) return;
  audio.volume = volume;
  audio.muted = false;
  set({ volume, muted: false });
}

export function toggleMute() {
  if (!audio) return;
  audio.muted = !audio.muted;
  set({ muted: audio.muted });
}

export function toggleShuffle() {
  const shuffle = !state.shuffle;
  const c = currentOf(state);
  if (!c) return set({ shuffle });
  const b = build(c.playlist.tracks.length, c.index, shuffle);
  set({ shuffle, order: b.order, pos: b.pos });
}

export function cycleRepeat() {
  set({
    repeat:
      state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off',
  });
}

// ---------- Inisialisasi ----------

function onEnded() {
  if (!audio) return;
  const { repeat, pos, order } = state;
  if (repeat === 'one') {
    audio.currentTime = 0;
    return play();
  }
  if (pos + 1 < order.length || repeat === 'all') return next();
  set({ playing: false }); // akhir daftar, tanpa ulang: berhenti
}

function syncMediaSession() {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator))
    return;
  const c = currentOf(state);
  navigator.mediaSession.metadata = c
    ? new MediaMetadata({
        title: c.track.title,
        artist: c.track.artist,
        album: c.playlist.name,
        artwork: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
      })
    : null;
}

function registerMediaSession() {
  if (!('mediaSession' in navigator)) return;
  const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
    ['play', () => play()],
    ['pause', () => audio?.pause()],
    ['previoustrack', prev],
    ['nexttrack', next],
    ['seekto', (d) => d.seekTime != null && seek(d.seekTime)],
    ['seekbackward', (d) => seekBy(-(d.seekOffset ?? 10))],
    ['seekforward', (d) => seekBy(d.seekOffset ?? 10)],
  ];
  for (const [action, handler] of handlers) {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch {
      // aksi ini tidak didukung peramban
    }
  }
}

/** Dipanggil sekali dari PlayerBar setelah mount. Aman dipanggil berulang. */
export function initPlayer() {
  if (audio || typeof window === 'undefined') return;
  const el = (audio = new Audio());
  el.preload = 'metadata';
  el.addEventListener('play', () => set({ playing: true, error: false }));
  el.addEventListener('pause', () => set({ playing: false }));
  el.addEventListener('ended', onEnded);
  el.addEventListener('timeupdate', () => setTime(el.currentTime));
  el.addEventListener('loadedmetadata', () => setTime(el.currentTime));
  el.addEventListener('durationchange', () => setTime(el.currentTime));
  el.addEventListener(
    'error',
    () => el.getAttribute('src') && set({ playing: false, error: true }),
  );
  registerMediaSession();

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (!saved) return;
    const volume =
      typeof saved.volume === 'number'
        ? Math.min(1, Math.max(0, saved.volume))
        : 1;
    const repeat: Repeat = ['off', 'all', 'one'].includes(saved.repeat)
      ? saved.repeat
      : 'off';
    el.volume = volume;
    el.muted = !!saved.muted;
    state = {
      ...state,
      volume,
      muted: el.muted,
      shuffle: !!saved.shuffle,
      repeat,
    };
    const playlist = getPlaylist(saved.slug);
    const index =
      playlist?.tracks.findIndex((t) => t.file === saved.file) ?? -1;
    if (playlist && index >= 0) {
      const b = build(playlist.tracks.length, index, state.shuffle);
      load(playlist.slug, b.order, b.pos, false); // dipulihkan dalam keadaan jeda; autoplay tidak diizinkan peramban
    } else set({});
  } catch {
    // data tersimpan rusak: pakai nilai awal
  }
}
