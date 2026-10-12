'use client';

import Link from 'next/link';
import { Cover } from '@/components/sections/Cover';
import { PauseIcon, PlayIcon } from '@/components/ui/Icons';
import { playlistDuration, type Playlist } from '@/content/playlists';
import { formatTotal } from '@/lib/format';
import { currentOf, playPlaylist, toggle, usePlayerState } from '@/lib/player';

/** Kartu playlist di beranda: seluruh kartu membuka halaman playlist; tombol bulat memutarnya langsung. */
export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  const s = usePlayerState();
  const isCurrent = currentOf(s)?.playlist.slug === playlist.slug;
  const playing = isCurrent && s.playing;

  return (
    <article
      data-reveal
      className="group relative rounded-[18px] border border-line bg-white p-3 [transition:translate_.45s_var(--ease-soft),border-color_.35s] hover:-translate-y-1.5 hover:border-brand-primary"
    >
      <div className="relative">
        <Cover
          slug={playlist.slug}
          name={playlist.name}
          className="rounded-[12px]"
        />
        <button
          type="button"
          aria-label={`${playing ? 'Pause' : 'Play'} ${playlist.name}`}
          className="absolute right-3 bottom-3 z-2 grid h-12 w-12 place-items-center rounded-[50%] bg-white text-black shadow-[0_8px_24px_rgba(0,0,0,.25)] [transition:opacity_.25s,translate_.25s,scale_.15s] hover:scale-105 focus-visible:translate-y-0 focus-visible:opacity-100 active:scale-95 min-[1025px]:translate-y-2 min-[1025px]:opacity-0 min-[1025px]:group-hover:translate-y-0 min-[1025px]:group-hover:opacity-100 [&_svg]:h-5 [&_svg]:w-5"
          onClick={() => (isCurrent ? toggle() : playPlaylist(playlist.slug))}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
      <div className="px-1 pt-4 pb-2">
        <h3 className="text-[length:clamp(1.2rem,1.6vw,1.5rem)] leading-tight font-bold text-brand-primary">
          <Link
            href={`/playlist/${playlist.slug}`}
            className="after:absolute after:inset-0 after:z-1 after:rounded-[18px] after:content-['']"
          >
            {playlist.name}
          </Link>
        </h3>
        <p className="mt-1 text-[.9rem] text-muted">
          {playlist.tracks.length} tracks ·{' '}
          {formatTotal(playlistDuration(playlist))}
        </p>
      </div>
    </article>
  );
}
