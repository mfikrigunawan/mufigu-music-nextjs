// Membaca MUSIC_DIR (satu subfolder = satu playlist) dan menulis src/content/playlists.json.
// Jalankan setiap menambah/menghapus lagu: pnpm playlists  (lalu commit playlists.json).
// File MP3 TIDAK ikut Git; hanya daftar ini.
import { readdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { parseFile } from 'music-metadata';

// Muat MUSIC_DIR dari .env.local bila belum ada di environment.
if (!process.env.MUSIC_DIR && existsSync('.env.local')) {
  const m = (await readFile('.env.local', 'utf8')).match(/^MUSIC_DIR=(.+)$/m);
  if (m) process.env.MUSIC_DIR = m[1].trim();
}
const root = process.argv[2] ?? process.env.MUSIC_DIR;
if (!root || !existsSync(root)) {
  console.error(
    'MUSIC_DIR tidak ditemukan. Isi di .env.local atau beri path: pnpm playlists "<folder>"',
  );
  process.exit(1);
}

// Nama file tanpa pemisah "---": awalan -> nama artis.
const ARTIST_PREFIX = {};
// Judul yang tanda hubungnya harus dipertahankan (kunci = nama file tanpa ekstensi).
const TITLE_OVERRIDE = {
  'Depapepe---Hi-D!!': 'Hi-D!!',
  'Depapepe---Hi-d!!!': 'Hi-d!!!',
  'Ending-7---GLORY--Kimi-ga-Iru-Kara----Takako-Uehara':
    'GLORY (Kimi ga Iru Kara)',
};
// Nama artis yang tanda hubungnya hilang karena nama file memakai "-" sebagai spasi.
const ARTIST_OVERRIDE = { 'D 51': 'D-51' };

const words = (s) => s.replace(/-+/g, ' ').trim();
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const titleCase = (s) =>
  s.replace(/(^|\s)([a-z])/g, (_, sp, c) => sp + c.toUpperCase());
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function parse(file) {
  const base = file.replace(/\.mp3$/i, '');
  const parts = base.split(/-{3,}/);
  let label, title, artist;
  const lt = parts[0].match(/^(Opening|Ending)-(\d+)$/i);
  if (lt && parts.length >= 3) {
    label = `${lt[1].toLowerCase() === 'opening' ? 'OP' : 'ED'} ${lt[2]}`;
    [title, artist] = [words(parts[1]), words(parts.slice(2).join(' '))];
  } else if (parts.length >= 2) {
    [artist, title] = [words(parts[0]), words(parts.slice(1).join(' '))];
  } else {
    const key = Object.keys(ARTIST_PREFIX).find((k) =>
      base.toLowerCase().startsWith(k),
    );
    artist = key ? ARTIST_PREFIX[key] : '';
    title = titleCase(words(key ? base.slice(key.length) : base));
  }
  title = TITLE_OVERRIDE[base] ?? cap(title);
  artist = ARTIST_OVERRIDE[artist] ?? artist;
  const sort = lt
    ? [lt[1].toLowerCase() === 'opening' ? 0 : 1, Number(lt[2])]
    : [2, 0];
  return { base, label, title, artist, sort };
}

const dirs = (await readdir(root, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort((a, b) => a.localeCompare(b));
const playlists = [];
for (const dir of dirs) {
  const files = (await readdir(path.join(root, dir))).filter((f) =>
    /\.mp3$/i.test(f),
  );
  if (!files.length) continue;
  const tracks = [];
  for (const file of files) {
    const p = parse(file);
    const meta = await parseFile(path.join(root, dir, file), {
      duration: true,
    });
    tracks.push({
      file,
      title: p.title,
      artist: p.artist,
      ...(p.label && { label: p.label }),
      duration: Math.round(meta.format.duration ?? 0),
      sort: p.sort,
    });
  }
  tracks.sort(
    (a, b) =>
      a.sort[0] - b.sort[0] ||
      a.sort[1] - b.sort[1] ||
      a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }),
  );
  playlists.push({
    slug: slugify(dir),
    name: dir,
    dir,
    tracks: tracks.map((t) => ({ ...t, sort: undefined })),
  });
}

const out = path.join('src', 'content', 'playlists.json');
await writeFile(out, JSON.stringify(playlists, null, 2) + '\n');
console.log(
  `${out}: ${playlists.length} playlist, ${playlists.reduce((n, p) => n + p.tracks.length, 0)} lagu`,
);
for (const p of playlists) console.log(`  ${p.slug}: ${p.tracks.length}`);
