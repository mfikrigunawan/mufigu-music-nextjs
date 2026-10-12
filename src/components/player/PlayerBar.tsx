'use client';

import { useEffect, useState } from 'react';
import { Cover } from '@/components/sections/Cover';
import {
  MuteIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  RepeatIcon,
  RepeatOneIcon,
  ShuffleIcon,
  VolumeIcon,
} from '@/components/ui/Icons';
import { formatTime } from '@/lib/format';
import { gsap, useGSAP } from '@/lib/gsap';
import {
  currentOf,
  cycleRepeat,
  initPlayer,
  next,
  prev,
  seek,
  seekBy,
  setVolume,
  toggle,
  toggleMute,
  toggleShuffle,
  usePlayerState,
  usePlayerTime,
} from '@/lib/player';
import { cn } from '@/lib/utils';

const ctrl =
  'grid h-10 w-10 flex-none place-items-center rounded-[50%] text-[#d4d4d4] transition-colors duration-200 hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-40 [&_svg]:h-5 [&_svg]:w-5';
const on = 'text-[#9fc0b3] hover:text-[#b9d4c9]'; // tombol mode (shuffle/repeat) yang aktif
const clock = 'text-xs tabular-nums text-[#b5b5b5]';

function Seek({ disabled }: { disabled: boolean }) {
  const t = usePlayerTime();
  const [drag, setDrag] = useState<number | null>(null);
  const max = t.duration || 0;
  const value = Math.min(drag ?? t.current, max || 1);
  // Geser = hanya memperbarui tampilan; seek sungguhan saat dilepas, supaya tidak ada ratusan permintaan Range.
  const commit = () => {
    if (drag === null) return;
    seek(drag);
    setDrag(null);
  };
  return (
    <>
      <span className={cn(clock, 'text-right max860:col-2 max860:row-2')}>
        {formatTime(value)}
      </span>
      <input
        className="range max860:col-3 max860:row-2"
        type="range"
        min={0}
        max={max || 1}
        step={1}
        value={value}
        disabled={disabled}
        aria-label="Seek"
        aria-valuetext={`${formatTime(value)} of ${formatTime(max)}`}
        style={
          {
            '--pct': `${max ? (value / max) * 100 : 0}%`,
          } as React.CSSProperties
        }
        onChange={(e) => setDrag(Number(e.target.value))}
        onPointerUp={commit}
        onKeyUp={commit}
        onBlur={commit}
      />
      <span className={cn(clock, 'max860:col-4 max860:row-2')}>
        {formatTime(max)}
      </span>
    </>
  );
}

export function PlayerBar() {
  const s = usePlayerState();
  const c = currentOf(s);
  const idle = !c;

  useEffect(() => {
    initPlayer();
  }, []);

  // Pintasan keyboard. Dilewati saat fokus ada di kontrol interaktif (spasi/panah sudah punya arti di sana).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        el.closest(
          'input, textarea, select, button, a, [contenteditable="true"]',
        )
      )
        return;
      const actions: Record<string, () => void> = {
        ' ': toggle,
        ArrowLeft: () => seekBy(-5),
        ArrowRight: () => seekBy(5),
        n: next,
        p: prev,
        m: toggleMute,
      };
      const run = actions[e.key];
      if (!run) return;
      e.preventDefault();
      run();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(
      '[data-player]',
      { y: 48, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        delay: 0.5,
        ease: 'power3.out',
        clearProps: 'transform',
      },
    );
  }, []);

  const RepeatGlyph = s.repeat === 'one' ? RepeatOneIcon : RepeatIcon;
  const muted = s.muted || s.volume === 0;

  return (
    <div
      data-player
      role="region"
      aria-label="Music player"
      className="fixed inset-x-0 bottom-0 z-60 border-t border-white/10 bg-brand-primary pb-[env(safe-area-inset-bottom)] text-white"
    >
      <div className="wrap grid grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)_minmax(0,1fr)] items-center gap-x-4 py-3 max860:grid-cols-[auto_auto_minmax(0,1fr)_auto_auto] max860:gap-x-2 max860:gap-y-0 max860:py-2">
        {/* Lagu yang sedang diputar */}
        <div className="flex min-w-0 items-center gap-3 max860:col-[1/4] max860:row-1">
          {c ? (
            <span
              className="vinyl block h-12 w-12 flex-none"
              data-playing={s.playing}
            >
              <Cover
                slug={c.playlist.slug}
                name={c.playlist.name}
                className="h-full w-full rounded-[50%]"
              />
            </span>
          ) : (
            <span
              className="h-12 w-12 flex-none rounded-[50%] bg-[#262626]"
              aria-hidden="true"
            />
          )}
          <div className="min-w-0" aria-live="polite">
            <p className="truncate text-[.95rem] leading-tight font-semibold">
              {c ? c.track.title : 'Nothing playing'}
            </p>
            <p className="truncate text-[.8rem] text-[#b5b5b5]">
              {s.error
                ? "Couldn't play this track"
                : c
                  ? [c.track.artist, c.playlist.name]
                      .filter(Boolean)
                      .join(' · ')
                  : 'Pick a playlist to start'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-stretch max860:contents">
          <div className="flex items-center justify-center gap-1.5 max860:contents">
            <button
              type="button"
              className={cn(ctrl, s.shuffle && on, 'max860:col-1 max860:row-2')}
              aria-label="Shuffle"
              aria-pressed={s.shuffle}
              onClick={toggleShuffle}
            >
              <ShuffleIcon />
            </button>
            <div className="flex items-center gap-1.5 max860:col-[4/6] max860:row-1 max860:justify-self-end">
              <button
                type="button"
                className={ctrl}
                aria-label="Previous track"
                disabled={idle}
                onClick={prev}
              >
                <PrevIcon />
              </button>
              <button
                type="button"
                className="grid h-11 w-11 flex-none place-items-center rounded-[50%] bg-white text-black transition-[scale] duration-150 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-40 [&_svg]:h-5 [&_svg]:w-5"
                aria-label={s.playing ? 'Pause' : 'Play'}
                disabled={idle}
                onClick={toggle}
              >
                {s.playing ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button
                type="button"
                className={ctrl}
                aria-label="Next track"
                disabled={idle}
                onClick={next}
              >
                <NextIcon />
              </button>
            </div>
            <button
              type="button"
              className={cn(
                ctrl,
                s.repeat !== 'off' && on,
                'max860:col-5 max860:row-2',
              )}
              aria-label={`Repeat: ${s.repeat}`}
              aria-pressed={s.repeat !== 'off'}
              onClick={cycleRepeat}
            >
              <RepeatGlyph />
            </button>
          </div>
          <div className="grid grid-cols-[3rem_minmax(0,1fr)_3rem] items-center gap-3 max860:contents">
            <Seek disabled={idle} />
          </div>
        </div>

        {/* Volume (di layar sentuh volume diatur dari perangkat) */}
        <div className="flex items-center justify-end gap-1 max860:hidden">
          <button
            type="button"
            className={ctrl}
            aria-label={muted ? 'Unmute' : 'Mute'}
            aria-pressed={muted}
            onClick={toggleMute}
          >
            {muted ? <MuteIcon /> : <VolumeIcon />}
          </button>
          <input
            className="range max-w-28"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : s.volume}
            aria-label="Volume"
            style={
              {
                '--pct': `${(muted ? 0 : s.volume) * 100}%`,
              } as React.CSSProperties
            }
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
