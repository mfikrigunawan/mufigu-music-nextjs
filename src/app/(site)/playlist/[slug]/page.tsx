import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageAnimations } from '@/components/motion/PageAnimations';
import { PlaylistActions } from '@/components/player/PlaylistActions';
import { PlaylistTabs } from '@/components/player/PlaylistTabs';
import { TrackList } from '@/components/player/TrackList';
import { Cover } from '@/components/sections/Cover';
import {
  getLibrary,
  getPlaylist,
  getPlaylistTexts,
  getSite,
} from '@/content/cms';
import { playlistDuration } from '@/content/playlists';
import { formatTotal } from '@/lib/format';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: (await getPlaylist(slug))?.name };
}

export default async function PlaylistPage({ params }: Props) {
  const { slug } = await params;
  const [playlist, playlists, texts, site] = await Promise.all([
    getPlaylist(slug),
    getLibrary(),
    getPlaylistTexts(),
    getSite(),
  ]);
  if (!playlist) notFound();

  return (
    <>
      <PageAnimations />
      <section className="pt-[clamp(1.5rem,3vw,2.5rem)]">
        <div className="wrap grid gap-[clamp(1.5rem,3vw,3rem)]">
          <div data-intro>
            <PlaylistTabs playlists={playlists} current={playlist.slug} />
          </div>

          <div
            className="grid grid-cols-[minmax(0,15rem)_1fr] items-end gap-[clamp(1.25rem,3vw,3rem)] max640:grid-cols-[minmax(0,9rem)_1fr]"
            data-intro
          >
            <Cover
              color={playlist.color}
              name={playlist.name}
              className="rounded-[18px] shadow-[0_20px_50px_rgba(0,0,0,.15)]"
            />
            <div className="grid min-w-0 justify-items-start gap-4">
              <p className="text-[.8rem] font-medium tracking-[.08em] text-muted uppercase">
                {texts.eyebrow}
              </p>
              <h1 className="text-[length:clamp(2rem,5.2vw,5rem)] leading-none font-extrabold tracking-[-.025em] break-words text-black">
                {playlist.name}
              </h1>
              <p className="text-muted">
                {playlist.tracks.length} {site.tracksWord} ·{' '}
                {formatTotal(playlistDuration(playlist))}
              </p>
              <PlaylistActions
                playlist={playlist}
                texts={{
                  play: texts.play,
                  pause: texts.pause,
                  shuffle: texts.shuffle,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="section pt-[clamp(2rem,4vw,3.5rem)]"
        aria-label="Tracks"
      >
        <div className="wrap">
          <TrackList playlist={playlist} />
        </div>
      </section>
    </>
  );
}
