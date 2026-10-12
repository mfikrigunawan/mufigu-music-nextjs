'use client';

import { Button } from '@/components/ui/Button';
import { PauseIcon, PlayIcon, ShuffleIcon } from '@/components/ui/Icons';
import type { Playlist } from '@/content/playlists';
import { currentOf, playPlaylist, toggle, usePlayerState } from '@/lib/player';

/** Tombol Play/Pause dan Shuffle di header playlist. */
export function PlaylistActions({ playlist }: { playlist: Playlist }) {
  const s = usePlayerState();
  const isCurrent = currentOf(s)?.playlist.slug === playlist.slug;
  const playing = isCurrent && s.playing;

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        more
        type="button"
        onClick={() => (isCurrent ? toggle() : playPlaylist(playlist.slug))}
      >
        {playing ? 'Pause' : 'Play'}
        {playing ? <PauseIcon /> : <PlayIcon />}
      </Button>
      <Button
        more
        variant="ghost"
        type="button"
        onClick={() =>
          playPlaylist(
            playlist.slug,
            Math.floor(Math.random() * playlist.tracks.length),
            true,
          )
        }
      >
        Shuffle
        <ShuffleIcon />
      </Button>
    </div>
  );
}
