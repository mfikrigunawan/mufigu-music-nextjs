import { coverColors } from '@/lib/cover';
import { cn } from '@/lib/utils';

/** Sampul playlist: gradien warna + huruf pertama nama berbentuk outline (selaras dengan judul outline situs). */
export function Cover({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const [from, to] = coverColors(slug);
  return (
    <div
      aria-hidden="true"
      className={cn(
        '[container-type:inline-size] relative grid aspect-square place-items-center overflow-hidden',
        className,
      )}
      style={{
        background: `radial-gradient(circle at 28% 22%, ${from}, ${to} 78%)`,
      }}
    >
      <span className="text-[length:62cqw] leading-none font-extrabold text-transparent select-none [-webkit-text-stroke:clamp(1px,1.1cqw,3px)_rgba(255,255,255,.85)]">
        {name.charAt(0)}
      </span>
    </div>
  );
}
