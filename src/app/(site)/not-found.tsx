import type { Metadata } from 'next';
import { BigTitle } from '@/components/sections/BigTitle';
import { Button } from '@/components/ui/Button';
import { heroCopy, heroSection, lede } from '@/components/ui/styles';
import { getSite } from '@/content/cms';

export const metadata: Metadata = { title: 'Not found' };

export default async function NotFound() {
  const site = await getSite();
  return (
    <section className={heroSection}>
      <div className="wrap">
        <div className={heroCopy}>
          <BigTitle
            level="h1"
            outline={site.notFoundOutline ?? ''}
            solid={site.notFoundSolid ?? ''}
          />
          <p className={lede}>{site.notFoundText}</p>
          <Button more href={site.notFoundUrl}>
            {site.notFoundButton}
          </Button>
        </div>
      </div>
    </section>
  );
}
