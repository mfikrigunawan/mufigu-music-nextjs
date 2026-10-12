'use client';

import { PlayIcon } from '@/components/ui/Icons';
import type { Playlist } from '@/content/playlists';
import { formatTime } from '@/lib/format';
import { currentOf, playTrack, usePlayerState } from '@/lib/player';
import { Equalizer } from './Equalizer';

/** Daftar lagu satu playlist. Klik lagu = putar; klik lagu yang sedang aktif = jeda/lanjut. */
export function TrackList({ playlist }: { playlist: Playlist }) {
  const s = usePlayerState();
  const c = currentOf(s);
  const active = c?.playlist.slug === playlist.slug ? c.track.file : null;

  return (
    <ol
      aria-label={`${playlist.name} tracks`}
      className="border-t border-brand-primary pt-2"
    >
      {playlist.tracks.map((t, i) => {
        const isActive = t.file === active;
        return (
          <li key={t.file} data-row>
            <button
              type="button"
              className="group grid w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-[12px] px-2 py-3 text-left transition-colors duration-200 hover:bg-[#f5f5f5] aria-[current=true]:bg-[#eef3f0] max640:gap-2"
              aria-current={isActive}
              onClick={() => playTrack(playlist.slug, i)}
            >
              <span className="flex justify-center text-sm text-muted tabular-nums [&_svg]:h-4 [&_svg]:w-4">
                {isActive ? (
                  <span className="text-[#3f5c50]">
                    <Equalizer playing={s.playing} />
                  </span>
                ) : (
                  <>
                    <span className="group-hover:hidden group-focus-visible:hidden">
                      {i + 1}
                    </span>
                    <span className="hidden text-brand-primary group-hover:block group-focus-visible:block">
                      <PlayIcon />
                    </span>
                  </>
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium text-brand-primary group-aria-[current=true]:text-[#3f5c50]">
                  {t.title}
                </span>
                <span className="block truncate text-[.85rem] text-muted">
                  {t.artist}
                </span>
              </span>
              <span className="flex items-center gap-3 text-sm text-muted tabular-nums">
                {t.label && (
                  <span className="rounded-[999px] border border-line px-2.5 py-0.5 text-[.7rem] font-semibold tracking-[.04em] text-[#4a4a4a]">
                    {t.label}
                  </span>
                )}
                {formatTime(t.duration)}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
