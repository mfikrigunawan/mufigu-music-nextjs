import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

// Tanpa animasi: axe membaca keadaan akhir, bukan elemen yang sedang fade-in (kontras palsu).
test.use({ reducedMotion: 'reduce' });

const pages = ['/', '/playlist/depapepe', '/playlist/one-piece'];

for (const path of pages) {
  test(`${path} termuat, punya satu h1, lolos cek aksesibilitas dasar`, async ({
    page,
  }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('[data-marquee-wrap]') // teks outline dekoratif (aria-hidden), tanpa isi untuk dibaca
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test('URL yang tidak dikenal menampilkan halaman 404', async ({ page }) => {
  const res = await page.goto('/playlist/tidak-ada');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText(/not found/i);
});

test('route media: Range 206, file tak terdaftar 404', async ({ request }) => {
  const list = JSON.parse(readFileSync('src/content/playlists.json', 'utf8'));
  const file = encodeURIComponent(list[1].tracks[0].file);
  const res = await request.get(`/media/${list[1].slug}/${file}`, {
    headers: { Range: 'bytes=0-9' },
  });
  expect(res.status()).toBe(206);
  expect(res.headers()['content-range']).toMatch(/^bytes 0-9\//);
  expect((await res.body()).length).toBe(10);
  expect(
    (await request.get('/media/one-piece/..%2F..%2Fsecret.txt')).status(),
  ).toBe(404);
});

test('memutar lagu, lanjut lintas halaman, dan next track', async ({
  page,
}) => {
  await page.goto('/playlist/one-piece');
  const player = page.getByRole('region', { name: 'Music player' });
  await page.getByRole('button', { name: /We Are!/ }).click();
  await expect(player.getByRole('button', { name: 'Pause' })).toBeVisible();
  await expect(player.getByText('We Are!')).toBeVisible();

  // pindah halaman lewat link internal: lagu tidak berhenti
  await page.getByRole('link', { name: 'Depapepe' }).click();
  await expect(page).toHaveURL(/\/playlist\/depapepe/);
  await expect(player.getByRole('button', { name: 'Pause' })).toBeVisible();

  await player.getByRole('button', { name: 'Next track' }).click();
  await expect(player.getByText('Believe')).toBeVisible();
});
