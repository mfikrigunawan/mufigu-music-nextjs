'use client';

import { Button } from '@/components/ui/Button';
import { PauseIcon, PlayIcon, ShuffleIcon } from '@/components/ui/Icons';
import type { Playlist } from '@/content/playlists';
import { currentOf, playPlaylist, toggle, usePlayerState } from '@/lib/player';

/** Tombol Play/Pause dan Shuffle di header playlist. */
export function PlaylistActions({
  playlist,
  texts,
}: {
  playlist: Playlist;
  texts: Record<'play' | 'pause' | 'shuffle', string | null | undefined>;
}) {
  const s = usePlayerState();
  const isCurrent = currentOf(s)?.playlist.slug === playlist.slug;
  const playing = isCurrent && s.playing;

  return (
    <div className="flex flex-wrap gap-3 max640:mt-2 max640:justify-center">
      <Button
        more
        type="button"
        onClick={() => (isCurrent ? toggle() : playPlaylist(playlist))}
      >
        {playing ? texts.pause : texts.play}
        {playing ? <PauseIcon /> : <PlayIcon />}
      </Button>
      <Button
        more
        variant="ghost"
        type="button"
        onClick={() =>
          playPlaylist(
            playlist,
            Math.floor(Math.random() * playlist.tracks.length),
            true,
          )
        }
      >
        {texts.shuffle}
        <ShuffleIcon />
      </Button>
    </div>
  );
}
