'use client';

import { Suggestion } from '@/components/suggestion';
import { useScopedI18n } from '@/locales/client';
import { Heading } from '@ecomm/ui/typography';
import { Filter } from 'lucide-react';
import { useClearRefinements } from 'react-instantsearch-core';

export function ProductNoResults() {
  const { canRefine } = useClearRefinements();
  const t = useScopedI18n('productListing');

  return (
    <div className="mx-auto flex max-w-[450px] flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-muted rounded-full p-6">
          <Filter size={40} />
        </div>
        <div className="flex flex-col gap-2 text-center">
          <Heading as="h2" className="!text-xl">
            {t('noResult.title')}
          </Heading>
          <p className="text-muted-foreground text-sm">
            {canRefine
              ? t('noResult.descriptionWithFilters')
              : t('noResult.description')}
          </p>
        </div>
      </div>
      {canRefine && (
        <div className="flex flex-col gap-2">
          <span className="text-sm">{t('noResult.suggestions.title')}:</span>
          <ul>
            <Suggestion>{t('noResult.suggestions.suggestionOne')}</Suggestion>
            <Suggestion>{t('noResult.suggestions.suggestionTwo')}</Suggestion>
            <Suggestion>{t('noResult.suggestions.suggestionThree')}</Suggestion>
          </ul>
        </div>
      )}
    </div>
  );
}
