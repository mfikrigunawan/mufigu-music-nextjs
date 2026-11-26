import path from 'node:path';
import { parseBuffer } from 'music-metadata';
import { ValidationError, type CollectionConfig } from 'payload';
import { parseFilename, slugify } from './filename';

// Tanpa `access`: bawaan Payload = hanya pengguna yang login. Halaman publik membaca lewat Local API di server.

/** File upload disimpan di subfolder MUSIC_DIR (volume persisten di server). */
export const uploadDir = path.resolve(
  process.env.MUSIC_DIR || 'music',
  '_uploads',
);

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Pengguna', plural: 'Pengguna' },
  admin: { useAsTitle: 'email', group: 'Sistem' },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },
  fields: [],
};

export const Tracks: CollectionConfig = {
  slug: 'tracks',
  labels: { singular: 'Musik', plural: 'Musik' },
  admin: {
    useAsTitle: 'title',
    group: 'Musik',
    defaultColumns: ['title', 'artist', 'label', 'tags', 'duration'],
    listSearchableFields: ['title', 'artist', 'label', 'filename'],
    pagination: { defaultLimit: 25, limits: [25, 50, 100, 500] },
  },
  defaultSort: 'title',
  // Tanpa `mimeTypes`: detektor bawaan Payload menolak sebagian MP3 yang sah, jadi isinya diperiksa di hook di bawah.
  upload: { staticDir: uploadDir },
  hooks: {
    beforeChange: [
      // Upload baru/ganti file: isi durasi, dan judul/artis/label yang masih kosong dari nama file.
      async ({ data, req, originalDoc }) => {
        if (!req.file) return data;
        const parsed: Partial<Record<'title' | 'artist' | 'label', string>> =
          parseFilename(req.file.name);
        for (const key of ['title', 'artist', 'label'] as const)
          data[key] = data[key] || originalDoc?.[key] || parsed[key];
        const meta = await parseBuffer(req.file.data, 'audio/mpeg', {
          duration: true,
        }).catch(() => null);
        if (
          !/.mp3$/i.test(req.file.name) ||
          meta?.format.container !== 'MPEG' ||
          !meta.format.duration
        )
          throw new ValidationError({
            errors: [{ path: 'file', message: 'File harus MP3 yang valid.' }],
          });
        data.mimeType = 'audio/mpeg';
        data.duration = Math.round(meta.format.duration);
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'title',
      label: 'Judul',
      type: 'text',
      index: true,
      admin: { description: 'Kosongkan untuk diisi otomatis dari nama file.' },
    },
    { name: 'artist', label: 'Artis', type: 'text', index: true },
    {
      name: 'label',
      label: 'Label',
      type: 'text',
      admin: { description: 'Opsional, misalnya "OP 1" atau "ED 7".' },
    },
    {
      name: 'tags',
      label: 'Tag',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'duration',
      label: 'Durasi (detik)',
      type: 'number',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'playlists',
      label: 'Ada di playlist',
      type: 'join',
      collection: 'playlists',
      on: 'tracks',
    },
  ],
};

export const Playlists: CollectionConfig = {
  slug: 'playlists',
  labels: { singular: 'Playlist', plural: 'Playlist' },
  orderable: true, // urutan di beranda diatur dengan drag di daftar
  admin: {
    useAsTitle: 'name',
    group: 'Musik',
    defaultColumns: ['name', 'slug', 'tracks'],
  },
  fields: [
    { name: 'name', label: 'Nama', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description:
          'Alamat halaman: /playlist/<slug>. Kosongkan untuk dibuat dari nama.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data, originalDoc }) =>
            slugify(value || data?.name || originalDoc?.name || ''),
        ],
      },
    },
    {
      name: 'tracks',
      label: 'Lagu',
      type: 'relationship',
      relationTo: 'tracks',
      hasMany: true,
      admin: { description: 'Geser untuk mengatur urutan putar.' },
    },
  ],
};

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: { singular: 'Tag', plural: 'Tag' },
  admin: { useAsTitle: 'name', group: 'Musik' },
  defaultSort: 'name',
  fields: [
    {
      name: 'name',
      label: 'Nama',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'tracks',
      label: 'Lagu dengan tag ini',
      type: 'join',
      collection: 'tracks',
      on: 'tags',
    },
  ],
};
