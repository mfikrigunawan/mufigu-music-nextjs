import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function IconButton({ className, ...props }: ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'grid h-10 w-10 flex-none place-items-center rounded-[50%] text-[#5f5f5f] transition-colors duration-200 hover:bg-[#f1f1f1] hover:text-brand-primary disabled:pointer-events-none disabled:opacity-40 [&_svg]:h-[1.3rem] [&_svg]:w-[1.3rem]',
        className,
      )}
      {...props}
    />
  );
}
