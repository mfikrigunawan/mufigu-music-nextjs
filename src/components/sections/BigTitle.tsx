import { cn } from '@/lib/utils';
import {
  bigInner,
  bigLine,
  bigOutline,
  bigSolid,
  bigTitle,
} from '@/components/ui/styles';

/** Judul besar dua baris: baris pertama outline, baris kedua tebal. `level` h1 untuk judul halaman. */
export function BigTitle({
  id,
  outline,
  solid,
  level: Tag = 'h2',
}: {
  id?: string;
  outline: string;
  solid: string;
  level?: 'h1' | 'h2';
}) {
  return (
    <Tag className={bigTitle} id={id} data-title>
      <span className={bigLine}>
        <span className={cn(bigInner, bigOutline)}>{outline}</span>
      </span>{' '}
      <span className={bigLine}>
        <span className={cn(bigInner, bigSolid)}>{solid}</span>
      </span>
    </Tag>
  );
}
