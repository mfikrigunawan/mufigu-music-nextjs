import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageAnimations } from '@/components/motion/PageAnimations';
import { PlaylistActions } from '@/components/player/PlaylistActions';
import { PlaylistTabs } from '@/components/player/PlaylistTabs';
import { TrackList } from '@/components/player/TrackList';
import { Cover } from '@/components/sections/Cover';
import { getPlaylist, playlistDuration, playlists } from '@/content/playlists';
import { formatTotal } from '@/lib/format';

type Props = { params: Promise<{ slug: string }> };

// Hanya playlist yang terdaftar yang valid; slug lain jatuh ke 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return playlists.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: getPlaylist(slug)?.name };
}

export default async function PlaylistPage({ params }: Props) {
  const { slug } = await params;
  const playlist = getPlaylist(slug);
  if (!playlist) notFound();

  return (
    <>
      <PageAnimations />
      <section className="pt-[clamp(1.5rem,3vw,2.5rem)]">
        <div className="wrap grid gap-[clamp(1.5rem,3vw,3rem)]">
          <div data-intro>
            <PlaylistTabs current={playlist.slug} />
          </div>

          <div
            className="grid grid-cols-[minmax(0,15rem)_1fr] items-end gap-[clamp(1.25rem,3vw,3rem)] max640:grid-cols-[minmax(0,9rem)_1fr]"
            data-intro
          >
            <Cover
              slug={playlist.slug}
              name={playlist.name}
              className="rounded-[18px] shadow-[0_20px_50px_rgba(0,0,0,.15)]"
            />
            <div className="grid min-w-0 justify-items-start gap-4">
              <p className="text-[.8rem] font-medium tracking-[.08em] text-muted uppercase">
                Playlist
              </p>
              <h1 className="text-[length:clamp(2rem,5.2vw,5rem)] leading-none font-extrabold tracking-[-.025em] break-words text-black">
                {playlist.name}
              </h1>
              <p className="text-muted">
                {playlist.tracks.length} tracks ·{' '}
                {formatTotal(playlistDuration(playlist))}
              </p>
              <PlaylistActions playlist={playlist} />
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
