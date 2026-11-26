// Sekali jalan saat CMS pertama kali dinyalakan: simpan teks bawaan dan impor lagu lama
// (src/content/playlists.json + file di MUSIC_DIR) ke CMS. File asli tidak diubah, hanya disalin ke _uploads.
import { existsSync } from 'node:fs';
import path from 'node:path';
import type { Payload } from 'payload';
import seedData from '../content/playlists.json';

export async function seed(payload: Payload) {
  const site = await payload.findGlobal({ slug: 'site' });
  if (site.seeded) return;

  for (const slug of ['home', 'playlist-page'] as const)
    await payload.updateGlobal({ slug, data: {} });

  const root = process.env.MUSIC_DIR;
  let missing = 0;
  for (const playlist of seedData) {
    const found = await payload.count({
      collection: 'playlists',
      where: { slug: { equals: playlist.slug } },
    });
    if (found.totalDocs) continue;

    const ids: number[] = [];
    for (const t of playlist.tracks) {
      const filePath = path.join(root ?? '', playlist.dir, t.file);
      if (!root || !existsSync(filePath)) {
        missing++;
        continue;
      }
      const existing = await payload.find({
        collection: 'tracks',
        where: { filename: { equals: t.file } },
        limit: 1,
      });
      const doc =
        existing.docs[0] ??
        (await payload.create({
          collection: 'tracks',
          filePath,
          data: {
            title: t.title,
            artist: t.artist,
            label: 'label' in t ? t.label : undefined,
          },
        }));
      ids.push(doc.id);
    }
    // Playlist baru dibuat kalau semua lagunya ada, supaya impor bisa diulang setelah folder musik terpasang.
    if (ids.length === playlist.tracks.length)
      await payload.create({
        collection: 'playlists',
        data: { name: playlist.name, slug: playlist.slug, tracks: ids },
      });
  }

  if (missing)
    payload.logger.warn(
      `Impor musik: ${missing} file tidak ditemukan di MUSIC_DIR, dicoba lagi saat start berikutnya.`,
    );
  await payload.updateGlobal({ slug: 'site', data: { seeded: !missing } });
}
