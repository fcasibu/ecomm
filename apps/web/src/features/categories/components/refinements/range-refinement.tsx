'use client';

import { useEffect, useState } from 'react';
import type { useRange } from 'react-instantsearch-core';
import { MultiThumbSlider } from '@ecomm/ui/slider';
import { Badge } from '@ecomm/ui/badge';
import { useStore } from '@/features/store/providers/store-provider';
import { formatPrice } from '@ecomm/lib/format-price';

export function RangeRefinement({
  range,
  refine,
  start,
}: ReturnType<typeof useRange>) {
  const store = useStore();

  const rangeMin = range.min ?? 0;
  const rangeMax = range.max ?? 0;
  const [startRange, endRange] = start;
  const minPrice = (startRange === -Infinity ? rangeMin : startRange) ?? 0;
  const maxPrice = (endRange === Infinity ? rangeMax : endRange) ?? 0;

  const [min, setMin] = useState<number>(minPrice);
  const [max, setMax] = useState<number>(maxPrice);

  useEffect(() => {
    if (startRange === -Infinity) {
      setMin(rangeMin);
    }

    if (endRange === Infinity) {
      setMax(rangeMax);
    }
  }, [startRange, endRange, rangeMin, rangeMax]);

  return (
    <div className="flex flex-col gap-4">
      <MultiThumbSlider
        value={[min, max]}
        min={rangeMin}
        max={rangeMax}
        minStepsBetweenThumbs={1}
        step={1}
        onValueCommit={() => {
          refine([
            Number.isFinite(min) ? min : undefined,
            Number.isFinite(max) ? max : undefined,
          ]);
        }}
        onValueChange={(value) => {
          const [newMin, newMax] = value;

          setMin(newMin || min);
          setMax(newMax || max);
        }}
      />
      <div className="flex items-center justify-between">
        <Badge
          className="flex justify-center px-6 text-sm font-normal"
          variant="outline"
        >
          {formatPrice(min, store.currency, { minimumFractionDigits: 0 })}
        </Badge>
        <Badge
          className="flex justify-center px-6 text-sm font-normal"
          variant="outline"
        >
          {formatPrice(max, store.currency, { minimumFractionDigits: 0 })}
        </Badge>
      </div>
    </div>
  );
}
