'use client';

import { useEffect, useState, type ReactNode } from 'react';

/**
 * Progress upload di CMS. Payload mengirim form lewat `fetch`, yang tidak punya progress upload,
 * jadi khusus request berisi file dialihkan ke XMLHttpRequest. Request lain tidak disentuh.
 */
export default function UploadProgress({ children }: { children: ReactNode }) {
  const [upload, setUpload] = useState<{ name: string; percent: number }>();

  useEffect(() => {
    const original = window.fetch;
    window.fetch = (input, init) => {
      const body = init?.body;
      const file = body instanceof FormData ? body.get('file') : null;
      if (!(file instanceof File) || typeof input !== 'string')
        return original(input, init);

      return new Promise<Response>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open((init?.method || 'POST').toUpperCase(), input);
        xhr.withCredentials = init?.credentials === 'include';
        xhr.responseType = 'blob';
        new Headers(init?.headers).forEach((v, k) =>
          xhr.setRequestHeader(k, v),
        );
        setUpload({ name: file.name, percent: 0 });
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable)
            setUpload({
              name: file.name,
              percent: Math.floor((e.loaded / e.total) * 100),
            });
        };
        xhr.onload = () => {
          const type = xhr.getResponseHeader('content-type') || '';
          resolve(
            new Response(xhr.response, {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: { 'content-type': type },
            }),
          );
        };
        xhr.onerror = () =>
          reject(new TypeError('Upload gagal: koneksi putus'));
        xhr.onabort = () =>
          reject(new DOMException('Upload dibatalkan', 'AbortError'));
        xhr.onloadend = () => setUpload(undefined);
        init?.signal?.addEventListener('abort', () => xhr.abort());
        xhr.send(body as FormData);
      });
    };
    return () => {
      window.fetch = original;
    };
  }, []);

  return (
    <>
      {children}
      {upload && (
        <div
          role="status"
          style={{
            position: 'fixed',
            right: 20,
            bottom: 20,
            zIndex: 10000,
            width: 'min(360px, calc(100vw - 40px))',
            padding: 16,
            borderRadius: 8,
            border: '1px solid var(--theme-elevation-150)',
            background: 'var(--theme-elevation-50)',
            color: 'var(--theme-text)',
            boxShadow: '0 8px 30px rgba(0,0,0,.25)',
          }}
        >
          <strong>
            {upload.percent < 100
              ? `Mengunggah… ${upload.percent}%`
              : 'Memproses file di server…'}
          </strong>
          <progress
            max={100}
            value={upload.percent}
            aria-label="Progress upload"
            style={{ display: 'block', width: '100%', margin: '8px 0' }}
          />
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {upload.name}
          </div>
          <small>Jangan tutup tab ini sampai selesai.</small>
        </div>
      )}
    </>
  );
}
