import { PageAnimations } from '@/components/motion/PageAnimations';
import { PlaylistCard } from '@/components/player/PlaylistCard';
import { BigTitle } from '@/components/sections/BigTitle';
import { Button } from '@/components/ui/Button';
import {
  stat,
  statLabel,
  statsGrid,
  statValue,
  heroCopy,
  heroSection,
  lede,
  sectionGhost,
  sectionMain,
  sectionTitle,
} from '@/components/ui/styles';
import { playlistDuration, playlists } from '@/content/playlists';
import { formatCompact } from '@/lib/format';

export default function HomePage() {
  const tracks = playlists.reduce((n, p) => n + p.tracks.length, 0);
  const seconds = playlists.reduce((n, p) => n + playlistDuration(p), 0);
  const stats = [
    { label: 'Playlists', value: playlists.length },
    { label: 'Tracks', value: tracks },
    { label: 'Of music', value: formatCompact(seconds) },
  ];

  return (
    <>
      <PageAnimations />
      <section className={heroSection} aria-labelledby="hero-title">
        <div className="wrap">
          <div className={heroCopy}>
            <BigTitle
              level="h1"
              id="hero-title"
              outline="Mufigu"
              solid="Music"
            />
            <p className={lede} data-intro>
              My own music player. Pick a playlist, press play, and keep
              browsing &mdash; the music never stops between pages.
            </p>
            <div className="flex flex-wrap gap-3" data-intro>
              <Button more href="#playlists">
                Browse playlists
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0" aria-label="Library">
        <div className="wrap">
          <dl className={statsGrid} data-intro>
            {stats.map((s) => (
              <div key={s.label} className={stat}>
                <dt className={statLabel}>{s.label}</dt>
                <dd className={statValue}>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Nama playlist berjalan mengikuti scroll (dekoratif) */}
      <div
        className="overflow-hidden border-y border-line py-5"
        data-marquee-wrap
        aria-hidden="true"
      >
        <div className="flex w-max gap-10 whitespace-nowrap" data-marquee>
          {Array.from({ length: 4 }, () => playlists)
            .flat()
            .map((p, i) => (
              <span
                key={i}
                className="text-[length:clamp(2.5rem,7vw,6rem)] leading-none font-extrabold text-transparent uppercase [-webkit-text-stroke:1.5px_#d9d9d9]"
              >
                {p.name}{' '}
                <span className="text-[#6f8f82] [-webkit-text-stroke:0]">
                  &#10022;
                </span>
              </span>
            ))}
        </div>
      </div>

      <section
        className="section"
        id="playlists"
        aria-labelledby="playlists-title"
      >
        <div className="wrap">
          <h2 className={sectionTitle} id="playlists-title" data-title>
            <span className={sectionGhost}>Pick a</span>
            <span className={sectionMain}>Playlist</span>
          </h2>
          <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[clamp(1rem,1.6vw,1.75rem)] max1024:grid-cols-[repeat(2,minmax(0,1fr))] max640:grid-cols-[1fr]">
            {playlists.map((p) => (
              <PlaylistCard key={p.slug} playlist={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
