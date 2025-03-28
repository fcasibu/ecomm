'use client';

import { Suggestion } from '@/components/suggestion';
import { useScopedI18n } from '@/locales/client';
import { Search } from 'lucide-react';

export function SearchNoResults() {
  const t = useScopedI18n('search.noResult');

  return (
    <div className="mx-auto flex max-w-[450px] flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-muted rounded-full p-4">
          <Search size={30} />
        </div>
        <div className="flex flex-col gap-2 text-center">
          <p className="text-lg font-bold">{t('title')}</p>
          <p className="text-muted-foreground text-sm">{t('description')}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm">{t('suggestions.title')}:</span>
        <ul>
          <Suggestion>{t('suggestions.suggestionOne')}</Suggestion>
          <Suggestion>{t('suggestions.suggestionTwo')}</Suggestion>
          <Suggestion>{t('suggestions.suggestionThree')}</Suggestion>
        </ul>
      </div>
    </div>
  );
}
