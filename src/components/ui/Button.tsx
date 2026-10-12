'use client';

import type { ComponentProps, MouseEvent, TransitionEvent } from 'react';
import Link from 'next/link';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { button } from './button-styles';

// Arah isi warna tombol lewat atribut data-fill (lihat button-styles.ts): idle -> in -> out -> idle.
// Langsung ke DOM, tanpa state React, supaya tidak ada render ulang saat hover.
const fill = {
  enter(e: MouseEvent<HTMLElement>) {
    const el = e.currentTarget;
    if (el.dataset.fill === 'out') {
      el.dataset.fill = 'idle';
      void el.offsetWidth;
    }
    el.dataset.fill = 'in';
  },
  leave(e: MouseEvent<HTMLElement>) {
    const el = e.currentTarget;
    if (el.dataset.fill === 'in') el.dataset.fill = 'out';
  },
  end(e: TransitionEvent<HTMLElement>) {
    if (
      e.pseudoElement === '::before' &&
      e.propertyName === 'translate' &&
      e.currentTarget.dataset.fill === 'out'
    )
      e.currentTarget.dataset.fill = 'idle';
  },
};

const fillProps = {
  'data-fill': 'idle',
  onMouseEnter: fill.enter,
  onMouseLeave: fill.leave,
  onTransitionEnd: fill.end,
} as const;

type ButtonProps = VariantProps<typeof button> & { href?: string } & Omit<
    ComponentProps<'button'>,
    'className'
  > & { className?: string };

/** `href` "/x" = Link internal, "#x" atau URL luar = <a>, tanpa href = <button>. */
export function Button({
  variant,
  more,
  href,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(button({ variant, more }), className);
  if (href === undefined) {
    return (
      <button className={classes} {...fillProps} {...rest}>
        {children}
      </button>
    );
  }
  const anchorProps = rest as ComponentProps<'a'>;
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={classes} {...fillProps} {...anchorProps}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} {...fillProps} {...anchorProps}>
      {children}
    </a>
  );
}
