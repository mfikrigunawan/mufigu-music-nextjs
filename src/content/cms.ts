// Pembaca data CMS untuk server component. `cache` = sekali query per request.
import config from '@payload-config';
import { getPayload } from 'payload';
import { cache } from 'react';
import type { Playlist } from './playlists';

export const cms = () => getPayload({ config });

export const getLibrary = cache(async (): Promise<Playlist[]> => {
  const payload = await cms();
  const { docs } = await payload.find({
    collection: 'playlists',
    sort: '_order',
    depth: 1,
    pagination: false,
  });
  return docs.map((p, color) => ({
    slug: p.slug,
    name: p.name,
    color,
    tracks: (p.tracks ?? []).flatMap((t) =>
      typeof t === 'object' && t.filename
        ? [
            {
              file: t.filename,
              title: t.title || t.filename,
              artist: t.artist ?? '',
              label: t.label || undefined,
              duration: t.duration ?? 0,
            },
          ]
        : [],
    ),
  }));
});

export const getPlaylist = async (slug: string) =>
  (await getLibrary()).find((p) => p.slug === slug);

export const getHome = cache(async () =>
  (await cms()).findGlobal({ slug: 'home' }),
);
export const getPlaylistTexts = cache(async () =>
  (await cms()).findGlobal({ slug: 'playlist-page' }),
);
export const getSite = cache(async () =>
  (await cms()).findGlobal({ slug: 'site' }),
);
