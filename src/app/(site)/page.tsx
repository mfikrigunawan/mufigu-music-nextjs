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
import { getHome, getLibrary, getSite } from '@/content/cms';
import { playlistDuration } from '@/content/playlists';
import { formatCompact } from '@/lib/format';

export default async function HomePage() {
  const [playlists, home, site] = await Promise.all([
    getLibrary(),
    getHome(),
    getSite(),
  ]);
  const tracks = playlists.reduce((n, p) => n + p.tracks.length, 0);
  const seconds = playlists.reduce((n, p) => n + playlistDuration(p), 0);
  const stats = [
    { label: home.statPlaylists, value: playlists.length },
    { label: home.statTracks, value: tracks },
    { label: home.statDuration, value: formatCompact(seconds) },
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
              outline={home.heroOutline ?? ''}
              solid={home.heroSolid ?? ''}
            />
            <p className={lede} data-intro>
              {home.heroText}
            </p>
            <div className="flex flex-wrap gap-3" data-intro>
              {home.buttons?.map((b, i) => (
                <Button
                  key={b.id}
                  more
                  href={b.url}
                  variant={i ? 'ghost' : 'primary'}
                >
                  {b.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0" aria-label="Library">
        <div className="wrap">
          <dl className={statsGrid} data-intro>
            {stats.map((s, i) => (
              <div key={i} className={stat}>
                <dt className={statLabel}>{s.label}</dt>
                <dd className={statValue}>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        className="section pt-0"
        id="playlists"
        aria-labelledby="playlists-title"
      >
        <div className="wrap">
          <h2 className={sectionTitle} id="playlists-title" data-title>
            <span className={sectionGhost}>{home.sectionOutline}</span>
            <span className={sectionMain}>{home.sectionSolid}</span>
          </h2>
          <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[clamp(1rem,1.6vw,1.75rem)] max1024:grid-cols-[repeat(2,minmax(0,1fr))] max640:grid-cols-[1fr]">
            {playlists.map((p) => (
              <PlaylistCard
                key={p.slug}
                playlist={p}
                tracksWord={site.tracksWord}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
