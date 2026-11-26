# Mufigu Music

Music player pribadi (case study untuk mufigu.com) di atas template Next.js 16 (App Router), Tailwind CSS v4, TypeScript, GSAP + ScrollTrigger, dan Lenis.
Konten (teks, tombol, playlist, musik, tag) diatur lewat Payload CMS di `/dashcmsmm2026`, dengan database Postgres.

Fitur: play/pause, previous/next, seek, volume, shuffle, repeat (off/all/one), pilih playlist, lanjut memutar saat pindah halaman,
ingat lagu/volume/mode terakhir, pintasan keyboard, kontrol layar kunci (Media Session), responsif dari HP sampai desktop.

## Menjalankan di lokal

```bash
pnpm install
cp .env.example .env.local   # isi MUSIC_DIR, DATABASE_URL, PAYLOAD_SECRET
pnpm db:dev                  # Postgres lokal (biarkan jalan di terminal sendiri)
pnpm migrate                 # sekali, dan setiap ada migrasi baru
pnpm dev                     # http://localhost:3000, CMS di /dashcmsmm2026
```

| Perintah                       | Fungsi                                                                             |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| `pnpm dev`                     | Dev server                                                                         |
| `pnpm build` lalu `pnpm start` | Build dan jalankan production                                                      |
| `pnpm migrate:create <nama>`   | Buat migrasi setelah mengubah field CMS (`src/cms/`)                               |
| `pnpm generate:types`          | Perbarui `src/payload-types.ts` setelah mengubah field CMS                         |
| `pnpm lint` / `pnpm typecheck` | Pemeriksaan kode                                                                   |
| `pnpm test:e2e`                | Smoke test, aksesibilitas, route audio, dan alur pemutaran (memakai Google Chrome) |

Pintasan keyboard: `Spasi` putar/jeda, `←` `→` mundur/maju 5 detik, `N` lagu berikutnya, `P` sebelumnya, `M` bisu.

## CMS

- **Musik:** upload satu per satu atau banyak sekaligus (Bulk Upload). Hanya MP3. Judul, artis, dan label yang kosong
  diisi dari nama file (`Artis---Judul.mp3` atau `Opening-1---Judul---Artis.mp3`); durasi dihitung otomatis.
- **Playlist:** pilih lagu dan geser untuk mengurutkan; urutan playlist di beranda diatur dengan drag di daftarnya.
- **Tag:** dipakai untuk filter di tabel musik.
- **Teks Situs:** semua teks, tombol, dan link yang terlihat.
- **Impor pertama:** saat pertama dinyalakan, lagu di `src/content/playlists.json` yang filenya ada di
  `MUSIC_DIR/<Playlist>/` disalin ke `MUSIC_DIR/_uploads` dan dimasukkan ke CMS. File asli tidak diubah.

## Struktur penting

```
src/
├── config/site.config.ts          # identitas situs: nama, URL, warna
├── payload.config.ts              # konfigurasi CMS
├── cms/                           # collection, teks situs, impor awal
├── migrations/                    # skema database
├── content/cms.ts                 # pembaca data CMS untuk halaman publik
├── content/playlists.ts           # tipe dan helper playlist
├── lib/player.ts                  # pemutar audio (satu <audio>, store di luar React, Media Session)
├── app/(payload)/                 # halaman CMS dan REST API
├── app/
│   ├── (site)/page.tsx                   # beranda: hero, statistik, daftar playlist
│   ├── (site)/playlist/[slug]/    # halaman playlist: daftar lagu
│   ├── media/[file]/              # penyaji MP3 dengan HTTP Range (hanya file yang tercatat di CMS)
│   └── api/                       # endpoint API
├── components/{layout,player,sections,motion,ui}
└── fonts/                         # Poppins (self-hosted)
```

## Deployment

Aplikasi dibangun dari `Dockerfile` dan dijalankan di server pribadi. Butuh Postgres.

- **Environment wajib:** `DATABASE_URL`, `PAYLOAD_SECRET`, `SERVER_URL`.
- **Musik:** volume di `/data/music` harus bisa **ditulis** oleh user `node` (uid 1000).
- **Migrasi** berjalan otomatis saat aplikasi start.
- **Setelah deploy pertama**, langsung buka `/dashcmsmm2026` dan buat akun admin: selama belum ada akun, siapa pun yang
  membuka alamat itu bisa membuatnya.
- **Backup:** database dan folder `_uploads`.
- **Deploy:** push ke `main` memicu build ulang otomatis.
- Situs tidak diindeks mesin pencari (`robots.txt` disallow, header `X-Robots-Tag`, meta `noindex`).

Detail server (akses, path, izin, kredensial) sengaja tidak dicatat di repo ini.
