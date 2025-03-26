'use client';

import {
  ATTRIBUTES_FOR_FACETING,
  type Attribute,
} from '@/features/algolia/utils/attributes-for-faceting';
import { RangeRefinement } from './refinements/range-refinement';
import { CheckboxRefinement } from './refinements/checkbox-refinement';
import {
  useClearRefinements,
  useCurrentRefinements,
  useRange,
  useRefinementList,
} from 'react-instantsearch-core';
import { useScopedI18n } from '@/locales/client';
import { Heading } from '@ecomm/ui/typography';
import { Button } from '@ecomm/ui/button';
import { X } from 'lucide-react';
import { useStore } from '@/features/store/providers/store-provider';
import { formatPrice } from '@ecomm/lib/format-price';

export function ProductFilters() {
  const filters = Object.values(ATTRIBUTES_FOR_FACETING).flat();
  const { refine: clearRefine, canRefine: canClearRefine } =
    useClearRefinements();

  return (
    <div className="lg:sticky lg:top-[100px]">
      <div className="flex flex-col gap-4">
        <FiltersHeader onClear={clearRefine} canClear={canClearRefine} />
        <AppliedFilters />
        {filters.map((filter) => (
          <RefinementComponent key={filter.attribute} {...filter} />
        ))}
      </div>
    </div>
  );
}

function FiltersHeader({
  onClear,
  canClear,
}: {
  onClear: () => void;
  canClear: boolean;
}) {
  const t = useScopedI18n('productListing.filters');
  return (
    <div className="flex items-center justify-between">
      <Heading as="h2" className="!text-lg">
        {t('title')}
      </Heading>
      <Button
        type="button"
        variant="none"
        className="p-0"
        onClick={onClear}
        disabled={!canClear}
      >
        {t('actions.clearAll')}
      </Button>
    </div>
  );
}

function RefinementComponent({ type, ...props }: Attribute) {
  switch (type) {
    case 'range':
      return <RangeFilter {...props} />;
    case 'checkbox':
      return <CheckboxFilter {...props} />;
    default:
      return null;
  }
}

function RangeFilter({
  attribute,
  label,
}: Pick<Attribute, 'attribute' | 'label'>) {
  const rangeProps = useRange({ attribute });
  const t = useScopedI18n('productListing.filters');

  return (
    <div className="flex flex-col gap-4">
      <span className="text-sm">{t(`labels.${label}`)}</span>
      <RangeRefinement {...rangeProps} />
    </div>
  );
}

function CheckboxFilter({ attribute, label }: Omit<Attribute, 'type'>) {
  const refinementListProps = useRefinementList({ attribute });
  const t = useScopedI18n('productListing.filters');

  if (!refinementListProps.items.length) return null;

  return (
    <div className="flex flex-col gap-4">
      <span className="text-sm">{t(`labels.${label}`)}</span>
      <CheckboxRefinement {...refinementListProps} />
    </div>
  );
}

function AppliedFilters() {
  const { items, canRefine } = useCurrentRefinements();
  const t = useScopedI18n('productListing.filters');

  if (!canRefine) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm">{t('appliedFilters.title')}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.flatMap((item) =>
          item.attribute !== 'price.value' ? (
            item.refinements.map((refinement) => (
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 rounded-full px-3 py-1 !text-xs [&_svg]:!size-3"
                onClick={() => item.refine(refinement)}
                key={refinement.value}
              >
                <span>{refinement.value}</span>
                <X />
              </Button>
            ))
          ) : (
            <PriceAppliedFilter
              key={item.attribute}
              attribute={item.attribute}
              refinements={item.refinements}
              refine={item.refine}
            />
          ),
        )}
      </div>
    </div>
  );
}

function PriceAppliedFilter({
  attribute,
  refinements,
  refine,
}: {
  attribute: string;
  refinements: ReturnType<
    typeof useCurrentRefinements
  >['items'][number]['refinements'];
  refine: (refinement: (typeof refinements)[number]) => void;
}) {
  const { range } = useRange({ attribute });
  const store = useStore();

  const minRefinement = refinements.find((ref) => ref.operator === '>=');
  const maxRefinement = refinements.find((ref) => ref.operator === '<=');

  const handleClearPrice = () => {
    if (minRefinement) refine(minRefinement);
    if (maxRefinement) refine(maxRefinement);
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="flex items-center gap-2 rounded-full px-3 py-1 !text-xs [&_svg]:!size-3"
      onClick={handleClearPrice}
    >
      <span>
        {formatPrice(
          (minRefinement?.value as number) ?? range.min ?? 0,
          store.currency,
          { minimumFractionDigits: 0 },
        )}{' '}
        -{' '}
        {formatPrice(
          (maxRefinement?.value as number) ?? range.max ?? 0,
          store.currency,
          { minimumFractionDigits: 0 },
        )}
      </span>
      <X />
    </Button>
  );
}
