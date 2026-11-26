import type { Field, GlobalConfig } from 'payload';

// Semua teks yang terlihat di situs. `defaultValue` = isi awal (sama persis dengan tampilan sebelum ada CMS).
const text = (name: string, label: string, defaultValue: string): Field => ({
  name,
  label,
  type: 'text',
  defaultValue,
});

/** Hanya path internal, anchor, http(s), atau mailto (bukan "javascript:"). */
const link = (name: string, label: string, defaultValue: string): Field => ({
  name,
  label,
  type: 'text',
  required: true,
  defaultValue,
  validate: (value: string | null | undefined) =>
    /^(\/|#|https?:\/\/|mailto:)/.test(value ?? '') ||
    'Awali dengan "/", "#", "https://", atau "mailto:".',
});

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Beranda',
  admin: { group: 'Teks Situs' },
  fields: [
    text('heroOutline', 'Judul baris 1 (outline)', 'Mufigu'),
    text('heroSolid', 'Judul baris 2 (tebal)', 'Music'),
    {
      name: 'heroText',
      label: 'Deskripsi',
      type: 'textarea',
      defaultValue:
        'My own music player. Pick a playlist, press play, and keep browsing — the music never stops between pages.',
    },
    {
      name: 'buttons',
      label: 'Tombol',
      labels: { singular: 'Tombol', plural: 'Tombol' },
      type: 'array',
      defaultValue: [{ label: 'Browse playlists', url: '#playlists' }],
      fields: [
        { name: 'label', label: 'Teks', type: 'text', required: true },
        link('url', 'Link', '#playlists'),
      ],
    },
    text('statPlaylists', 'Label statistik: jumlah playlist', 'Playlists'),
    text('statTracks', 'Label statistik: jumlah lagu', 'Tracks'),
    text('statDuration', 'Label statistik: total durasi', 'Of music'),
    text('sectionOutline', 'Judul daftar playlist (outline)', 'Pick a'),
    text('sectionSolid', 'Judul daftar playlist (tebal)', 'Playlist'),
  ],
};

export const PlaylistPage: GlobalConfig = {
  slug: 'playlist-page',
  label: 'Detail Playlist',
  admin: { group: 'Teks Situs' },
  fields: [
    text('eyebrow', 'Teks kecil di atas nama playlist', 'Playlist'),
    text('play', 'Tombol putar', 'Play'),
    text('pause', 'Tombol jeda', 'Pause'),
    text('shuffle', 'Tombol acak', 'Shuffle'),
  ],
};

export const Site: GlobalConfig = {
  slug: 'site',
  label: 'Pengaturan Situs',
  admin: { group: 'Teks Situs' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Umum',
          fields: [
            text('name', 'Nama situs (judul tab peramban)', 'Mufigu Music'),
            text(
              'description',
              'Deskripsi situs',
              'A personal music player by Mufigu: pick a playlist, press play.',
            ),
            text('tracksWord', 'Kata setelah jumlah lagu', 'tracks'),
            text('skipLink', 'Tautan lompat ke konten', 'Skip to content'),
          ],
        },
        {
          label: 'Header & Footer',
          fields: [
            text('headerWordmark', 'Teks di samping logo', 'Music'),
            text('headerLinkLabel', 'Teks link header', 'mufigu.com'),
            link('headerLinkUrl', 'Link header', 'https://mufigu.com'),
            text('footerLinkLabel', 'Teks link footer', 'Mufigu'),
            link('footerLinkUrl', 'Link footer', 'https://mufigu.com'),
            text('footerText', 'Teks footer', 'A personal music player.'),
          ],
        },
        {
          label: 'Player',
          fields: [
            text('playerEmpty', 'Belum ada lagu', 'Nothing playing'),
            text('playerHint', 'Petunjuk', 'Pick a playlist to start'),
            text(
              'playerError',
              'Lagu gagal dimuat',
              "Couldn't play this track",
            ),
          ],
        },
        {
          label: 'Halaman 404',
          fields: [
            text('notFoundOutline', 'Judul baris 1 (outline)', 'Track'),
            text('notFoundSolid', 'Judul baris 2 (tebal)', 'not found'),
            text(
              'notFoundText',
              'Keterangan',
              "That page doesn't exist, or the playlist was renamed.",
            ),
            text('notFoundButton', 'Teks tombol', 'Back to playlists'),
            link('notFoundUrl', 'Link tombol', '/'),
          ],
        },
      ],
    },
    // Penanda impor lagu lama (lihat seed.ts)
    { name: 'seeded', type: 'checkbox', admin: { hidden: true } },
  ],
};
