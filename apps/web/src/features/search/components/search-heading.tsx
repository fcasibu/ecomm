'use client';

import { NextLink } from '@/components/link';
import { link } from '@/lib/utils/link-helper';
import { useScopedI18n } from '@/locales/client';
import { Heading } from '@ecomm/ui/typography';
import { ArrowLeft } from 'lucide-react';

export function SearchHeading({ query }: { query: string }) {
  const t = useScopedI18n('search');

  return (
    <div className="flex flex-col gap-4">
      <NextLink
        href={link.home}
        className="text-muted-foreground flex items-center gap-2"
      >
        <ArrowLeft size={15} />
        {t('actions.backToHome')}
      </NextLink>
      <Heading as="h1" className="!text-xl">
        {t('results.title', { query })}
      </Heading>
    </div>
  );
}
