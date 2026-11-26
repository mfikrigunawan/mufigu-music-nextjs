// Postgres lokal tanpa Docker (data di .pgdata, tidak masuk Git). Biarkan jalan; Ctrl+C untuk berhenti.
import { existsSync, rmSync } from 'node:fs';
import EmbeddedPostgres from 'embedded-postgres';

const dir = '.pgdata';
const pg = new EmbeddedPostgres({
  databaseDir: dir,
  user: 'postgres',
  password: 'postgres',
  port: 5433,
  persistent: true,
  // Tanpa ini Windows memakai WIN1252 dan judul berhuruf Jepang ditolak.
  initdbFlags: ['--encoding=UTF8', '--locale=C'],
});
// Proses yang mati paksa meninggalkan postmaster.pid dan Postgres lalu menolak start.
rmSync(`${dir}/postmaster.pid`, { force: true });
const fresh = !existsSync(`${dir}/PG_VERSION`);
if (fresh) await pg.initialise();
await pg.start();
if (fresh) await pg.createDatabase('mufigu_music');
console.log('Postgres siap di :5433 (mufigu_music)');

for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, async () => {
    await pg.stop();
    process.exit(0);
  });
setInterval(() => {}, 1 << 30);
