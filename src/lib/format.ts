/** 3:07 atau 1:02:09 */
export function formatTime(seconds: number) {
  const s = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
}

/** 6 hr 44 min */
export function formatTotal(seconds: number) {
  const total = Math.round(seconds / 60);
  const h = Math.floor(total / 60);
  return h ? `${h} hr ${total % 60} min` : `${total} min`;
}

/** 6h 44m (untuk angka statistik yang besar) */
export function formatCompact(seconds: number) {
  const total = Math.round(seconds / 60);
  const h = Math.floor(total / 60);
  return h ? `${h}h ${total % 60}m` : `${total}m`;
}
