# Mufigu Music

Music player pribadi (case study untuk mufigu.com) di atas template Next.js 16 (App Router), Tailwind CSS v4, TypeScript, GSAP + ScrollTrigger, dan Lenis.
Tanpa CMS dan tanpa database: satu subfolder musik = satu playlist.

Fitur: play/pause, previous/next, seek, volume, shuffle, repeat (off/all/one), pilih playlist, lanjut memutar saat pindah halaman,
ingat lagu/volume/mode terakhir, pintasan keyboard, kontrol layar kunci (Media Session), responsif dari HP sampai desktop.

## Menjalankan di lokal

```bash
pnpm install
cp .env.example .env.local   # isi MUSIC_DIR dengan folder induk musik (lihat di bawah)
pnpm dev                     # http://localhost:3000
```

| Perintah                       | Fungsi                                                                             |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| `pnpm dev`                     | Dev server                                                                         |
| `pnpm build` lalu `pnpm start` | Build dan jalankan production                                                      |
| `pnpm playlists`               | Baca `MUSIC_DIR`, tulis ulang `src/content/playlists.json` (judul, artis, durasi)  |
| `pnpm lint` / `pnpm typecheck` | Pemeriksaan kode                                                                   |
| `pnpm test:e2e`                | Smoke test, aksesibilitas, route audio, dan alur pemutaran (memakai Google Chrome) |

Pintasan keyboard: `Spasi` putar/jeda, `←` `→` mundur/maju 5 detik, `N` lagu berikutnya, `P` sebelumnya, `M` bisu.

## Menambah lagu atau playlist

Struktur `MUSIC_DIR`: satu subfolder per playlist, isinya file `.mp3`.

```
MUSIC_DIR/
├── Depapepe/    *.mp3
├── One Piece/   *.mp3
└── Reggae/      *.mp3
```

1. Taruh file MP3 di folder playlist (folder baru = playlist baru) di PC.
2. `pnpm playlists` (membuat `src/content/playlists.json`). Judul dan artis diambil dari nama file; koreksi di bagian
   `ARTIST_PREFIX`, `TITLE_OVERRIDE`, atau `ARTIST_OVERRIDE` di `scripts/build-playlists.mjs` bila ada yang salah.
3. Unggah file MP3 baru ke folder musik di VPS (lihat Deployment). **MP3 tidak masuk Git.**
4. `git add -A && git commit && git push`: Coolify membangun ulang dan situs ter-update.

Urutan 3 dan 4 sebaiknya MP3 dulu, baru push, supaya tidak ada lagu yang tampil tetapi belum bisa diputar.

Konvensi nama file untuk pembacaan otomatis: `Artis---Judul.mp3`, atau `Opening-1---Judul---Artis.mp3` / `Ending-2---...` (diurutkan
sesuai nomor dan diberi label OP/ED). Tanda `-` dibaca sebagai spasi.

## Struktur penting

```
src/
├── config/site.config.ts          # identitas situs: nama, URL, warna
├── content/playlists.json         # DIBUAT oleh `pnpm playlists`; jangan diedit manual
├── content/playlists.ts           # tipe dan helper playlist
├── lib/player.ts                  # pemutar audio (satu <audio>, store di luar React, Media Session)
├── app/
│   ├── page.tsx                   # beranda: hero, statistik, daftar playlist
│   ├── playlist/[slug]/page.tsx   # halaman playlist: daftar lagu
│   ├── media/[playlist]/[file]/   # penyaji MP3 dengan HTTP Range (hanya file yang ada di playlists.json)
│   └── api/health/                # healthcheck
├── components/{layout,player,sections,motion,ui}
└── fonts/                         # Poppins (self-hosted)
```

## Deployment (Coolify di VPS)

Sama dengan `mufigu-nextjs`, tanpa CMS: satu aplikasi, domain `music.mufigu.com`, port 3000, build pack Dockerfile.

- **Volume musik:** pasang _persistent storage_ ke `/data/music` pada aplikasi (isi: subfolder playlist seperti di atas).
  `MUSIC_DIR=/data/music` sudah diset di `Dockerfile`.
- **Mengunggah musik:** `scp -r "<folder playlist>" user@IP-VPS:<path-volume>/` atau lewat terminal Coolify. Path volume di host
  terlihat di Coolify (Storages).
- **Izin file:** container berjalan sebagai user `node` (uid 1000), sama dengan user `deploy` di VPS yang memiliki folder musik.
  Coolify mereset izin folder mount menjadi 750 tiap deploy, jadi jangan mengandalkan izin `other`; upload file memakai user `deploy`.
- **Auto-deploy:** webhook GitHub (event push) ke Coolify aktif; `git push` ke `main` membangun ulang situs sendiri (sekitar 2 menit).
- **Healthcheck:** `/api/health`.
- **Tidak ada variabel environment wajib.**
- Situs tidak diindeks mesin pencari (`robots.txt` disallow, header `X-Robots-Tag`, meta `noindex`).
