import type { Metadata } from 'next';
import { BigTitle } from '@/components/sections/BigTitle';
import { Button } from '@/components/ui/Button';
import { heroCopy, heroSection, lede } from '@/components/ui/styles';

export const metadata: Metadata = { title: 'Not found' };

export default function NotFound() {
  return (
    <section className={heroSection}>
      <div className="wrap">
        <div className={heroCopy}>
          <BigTitle level="h1" outline="Track" solid="not found" />
          <p className={lede}>
            That page doesn&apos;t exist, or the playlist was renamed.
          </p>
          <Button more href="/">
            Back to playlists
          </Button>
        </div>
      </div>
    </section>
  );
}
