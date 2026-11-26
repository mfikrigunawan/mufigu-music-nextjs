'use client';

import Link from 'next/link';
import { Cover } from '@/components/sections/Cover';
import { PauseIcon, PlayIcon } from '@/components/ui/Icons';
import { playlistDuration, type Playlist } from '@/content/playlists';
import { formatTotal } from '@/lib/format';
import { currentOf, playPlaylist, toggle, usePlayerState } from '@/lib/player';

/** Kartu playlist di beranda: seluruh kartu membuka halaman playlist; tombol bulat memutarnya langsung. */
export function PlaylistCard({
  playlist,
  tracksWord,
}: {
  playlist: Playlist;
  tracksWord?: string | null;
}) {
  const s = usePlayerState();
  const isCurrent = currentOf(s)?.playlist.slug === playlist.slug;
  const playing = isCurrent && s.playing;

  return (
    <article
      data-reveal
      className="group relative rounded-[18px] border border-line bg-white p-3 [transition:translate_.45s_var(--ease-soft),border-color_.35s] hover:-translate-y-1.5 hover:border-brand-primary max640:rounded-[12px] max640:p-1.5"
    >
      <div className="relative">
        <Cover
          color={playlist.color}
          name={playlist.name}
          className="rounded-[12px] max640:rounded-[8px]"
        />
        <button
          type="button"
          aria-label={`${playing ? 'Pause' : 'Play'} ${playlist.name}`}
          className="absolute right-3 bottom-3 z-2 grid h-12 w-12 place-items-center rounded-[50%] bg-white text-black shadow-[0_8px_24px_rgba(0,0,0,.25)] [transition:opacity_.25s,translate_.25s,scale_.15s] hover:scale-105 focus-visible:translate-y-0 focus-visible:opacity-100 active:scale-95 min-[1025px]:translate-y-2 min-[1025px]:opacity-0 min-[1025px]:group-hover:translate-y-0 min-[1025px]:group-hover:opacity-100 max640:right-1 max640:bottom-1 max640:h-8 max640:w-8 [&_svg]:h-5 [&_svg]:w-5 max640:[&_svg]:h-3.5 max640:[&_svg]:w-3.5"
          onClick={() => (isCurrent ? toggle() : playPlaylist(playlist))}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
      <div className="px-1 pt-4 pb-2 wrap-anywhere max640:px-0.5 max640:pt-2 max640:pb-0.5">
        <h3 className="text-[length:clamp(1.2rem,1.6vw,1.5rem)] leading-tight font-bold text-brand-primary max640:text-[.85rem]">
          <Link
            href={`/playlist/${playlist.slug}`}
            className="after:absolute after:inset-0 after:z-1 after:rounded-[18px] after:content-[''] max640:after:rounded-[12px]"
          >
            {playlist.name}
          </Link>
        </h3>
        <p className="mt-1 text-[.9rem] text-muted max640:text-[.7rem] max640:leading-snug">
          {playlist.tracks.length} {tracksWord} ·{' '}
          {formatTotal(playlistDuration(playlist))}
        </p>
      </div>
    </article>
  );
}
