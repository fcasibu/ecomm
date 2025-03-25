'use client';

import type { useRefinementList } from 'react-instantsearch-core';
import { Checkbox } from '@ecomm/ui/checkbox';
import { Label } from '@ecomm/ui/label';
import { Button } from '@ecomm/ui/button';
import { useScopedI18n } from '@/locales/client';

export function CheckboxRefinement({
  items,
  refine,
  toggleShowMore,
  canToggleShowMore,
  isShowingMore,
}: ReturnType<typeof useRefinementList>) {
  const t = useScopedI18n('productListing.filters.checkbox');

  return (
    <div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.value} className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Checkbox
                id={item.value}
                checked={item.isRefined}
                onCheckedChange={() => refine(item.value)}
              />
              <span>{item.label}</span>
            </Label>
            <span className="text-muted-foreground">({item.count})</span>
          </li>
        ))}
      </ul>
      {canToggleShowMore && (
        <Button type="button" variant="none" onClick={toggleShowMore}>
          {!isShowingMore ? t('action.toggle.more') : t('action.toggle.less')}
        </Button>
      )}
    </div>
  );
}
