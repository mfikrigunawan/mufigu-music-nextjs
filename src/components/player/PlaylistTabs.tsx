'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { Playlist } from '@/content/playlists';

/** Pilihan playlist (chip) di atas halaman playlist: satu baris yang bisa digeser, playlist aktif otomatis di tengah. */
export function PlaylistTabs({
  playlists,
  current,
}: {
  playlists: Playlist[];
  current: string;
}) {
  const nav = useRef<HTMLElement>(null);

  // Hanya menggeser baris chip, bukan halaman (scrollIntoView bisa ikut menggeser halaman).
  useEffect(() => {
    const box = nav.current;
    const chip = box?.querySelector('[aria-current="page"]');
    if (!box || !chip) return;
    const b = box.getBoundingClientRect();
    const c = chip.getBoundingClientRect();
    box.scrollLeft += c.left + c.width / 2 - (b.left + b.width / 2);
  }, [current]);

  return (
    <nav
      ref={nav}
      aria-label="Playlists"
      // Tepi dipudarkan sebagai tanda masih ada chip di samping.
      className="-mx-(--pad) [scrollbar-width:none] overflow-x-auto [mask-image:linear-gradient(to_right,transparent,#000_var(--pad),#000_calc(100%-var(--pad)),transparent)] px-(--pad) py-1 [&::-webkit-scrollbar]:hidden"
      data-lenis-prevent-wheel
    >
      <ul className="flex w-max gap-2">
        {playlists.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/playlist/${p.slug}`}
              aria-current={p.slug === current ? 'page' : undefined}
              className="inline-block rounded-[999px] border-[1.5px] border-brand-primary px-5 py-2 text-[.9rem] font-semibold whitespace-nowrap text-brand-primary [transition:background-color_.25s,color_.25s] hover:bg-chip aria-[current=page]:bg-brand-primary aria-[current=page]:text-white max640:px-4"
            >
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
