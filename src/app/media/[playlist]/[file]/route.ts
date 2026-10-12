// Menyajikan MP3 dari MUSIC_DIR dengan dukungan HTTP Range (wajib agar seek dan Media Session berjalan).
// Hanya file yang tercantum di playlists.json yang bisa diminta, jadi path traversal tidak mungkin.
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { getPlaylist } from '@/content/playlists';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ playlist: string; file: string }> };

/**
 * Stream file -> Web stream. Dibuat manual (bukan Readable.toWeb) karena peramban sering membatalkan request di tengah jalan
 * (seek, ganti lagu); toWeb lalu melempar "Controller is already closed" sebagai uncaughtException.
 */
function fileStream(
  filePath: string,
  start: number,
  end: number,
  signal: AbortSignal,
) {
  const file = createReadStream(filePath, { start, end });
  let closed = false;
  const stop = () => {
    closed = true;
    file.destroy();
  };
  signal.addEventListener('abort', stop, { once: true });
  return new ReadableStream<Uint8Array>({
    start(controller) {
      file.on('data', (chunk) => {
        if (closed) return;
        try {
          controller.enqueue(chunk as Uint8Array);
          if ((controller.desiredSize ?? 1) <= 0) file.pause(); // tunggu pembaca menyusul (backpressure)
        } catch {
          stop();
        }
      });
      file.on('end', () => {
        if (closed) return;
        closed = true;
        try {
          controller.close();
        } catch {}
      });
      file.on('error', (err) => {
        if (closed) return;
        closed = true;
        try {
          controller.error(err);
        } catch {}
      });
    },
    pull() {
      if (!closed) file.resume();
    },
    cancel: stop,
  });
}

/** "bytes=0-99" / "bytes=100-" / "bytes=-500" -> [start, end]; null = tidak valid */
function parseRange(header: string, size: number): [number, number] | null {
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!m || (!m[1] && !m[2])) return null;
  let start = m[1] ? Number(m[1]) : size - Number(m[2]);
  const end = m[1] && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
  start = Math.max(0, start);
  return start > end || start >= size ? null : [start, end];
}

async function serve(req: Request, { params }: Ctx, head: boolean) {
  const { playlist: slug, file } = await params;
  const root = process.env.MUSIC_DIR;
  const playlist = getPlaylist(slug);
  const track = playlist?.tracks.find((t) => t.file === file);
  if (!root || !playlist || !track)
    return new Response('Not found', { status: 404 });

  const filePath = path.join(root, playlist.dir, track.file);
  const info = await stat(filePath).catch(() => null);
  if (!info?.isFile()) return new Response('Not found', { status: 404 });

  const size = info.size;
  const base = {
    'Content-Type': 'audio/mpeg',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=86400',
    'Last-Modified': info.mtime.toUTCString(),
  };

  const range = req.headers.get('range');
  let start = 0;
  let end = size - 1;
  let status = 200;
  const headers: Record<string, string> = { ...base };
  if (range) {
    const r = parseRange(range, size);
    if (!r)
      return new Response(null, {
        status: 416,
        headers: { 'Content-Range': `bytes */${size}` },
      });
    [start, end] = r;
    status = 206;
    headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
  }
  headers['Content-Length'] = String(end - start + 1);

  if (head) return new Response(null, { status, headers });
  const stream = fileStream(filePath, start, end, req.signal);
  return new Response(stream, { status, headers });
}

export const GET = (req: Request, ctx: Ctx) => serve(req, ctx, false);
export const HEAD = (req: Request, ctx: Ctx) => serve(req, ctx, true);
