import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { en } from '@payloadcms/translations/languages/en';
import { id } from '@payloadcms/translations/languages/id';
import { buildConfig } from 'payload';
import { Playlists, Tags, Tracks, Users } from './cms/collections';
import { Home, PlaylistPage, Site } from './cms/globals';
import { seed } from './cms/seed';
import { migrations } from './migrations';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

// Secret kosong tetap bisa jalan tetapi sesi login bisa ditebak. `next build` memang tanpa env.
if (
  process.env.NODE_ENV === 'production' &&
  !isBuild &&
  !process.env.PAYLOAD_SECRET
) {
  throw new Error('PAYLOAD_SECRET is required in production');
}

export default buildConfig({
  routes: { admin: '/dashcmsmm2026' },
  admin: {
    user: Users.slug,
    avatar: 'default', // tanpa Gravatar (diblokir CSP)
    importMap: { baseDir: path.resolve(dirname) },
    components: {
      // Logo Mufigu menggantikan logo Payload (login dan navigasi)
      graphics: {
        Logo: '/components/cms/Logo#default',
        Icon: '/components/cms/Icon#default',
      },
    },
    meta: {
      titleSuffix: ' - Mufigu Music CMS',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' }],
    },
  },
  i18n: { supportedLanguages: { id, en }, fallbackLanguage: 'id' },
  collections: [Tracks, Playlists, Tags, Users],
  globals: [Home, PlaylistPage, Site],
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.SERVER_URL,
  graphQL: { disable: true },
  telemetry: false,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations, // production: migrasi dijalankan otomatis saat start
    push: false,
  }),
  onInit: async (payload) => {
    if (!isBuild) await seed(payload);
  },
});
