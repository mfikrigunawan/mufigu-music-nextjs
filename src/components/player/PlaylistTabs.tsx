import Link from 'next/link';
import { playlists } from '@/content/playlists';

/** Pilihan playlist (chip) di atas halaman playlist; di layar sempit bisa digeser menyamping. */
export function PlaylistTabs({ current }: { current: string }) {
  return (
    <nav
      aria-label="Playlists"
      className="-mx-(--pad) [scrollbar-width:none] overflow-x-auto px-(--pad) pb-1 [&::-webkit-scrollbar]:hidden"
      data-lenis-prevent-wheel
    >
      <ul className="flex w-max gap-2">
        {playlists.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/playlist/${p.slug}`}
              aria-current={p.slug === current ? 'page' : undefined}
              className="inline-block rounded-[999px] border-[1.5px] border-brand-primary px-5 py-2 text-[.9rem] font-semibold whitespace-nowrap text-brand-primary [transition:background-color_.25s,color_.25s] hover:bg-chip aria-[current=page]:bg-brand-primary aria-[current=page]:text-white"
            >
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
