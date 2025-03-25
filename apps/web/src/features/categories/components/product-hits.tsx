import type { AlgoliaProductHit } from '@/features/algolia/types';
import { ProductHitCard } from './product-hit-card';
import { cn } from '@ecomm/ui/lib/utils';
import type { CustomImageProps } from '@ecomm/ui/image';

export function ProductHits({
  gridLayout,
  hits,
}: {
  gridLayout: '2x2' | '3x3';
  hits: AlgoliaProductHit[];
}) {
  if (!hits.length) return null;

  return (
    <div
      className={cn('grid grid-cols-2 gap-4', {
        'lg:grid-cols-3': gridLayout === '3x3',
        'lg:grid-cols-2': gridLayout === '2x2',
      })}
    >
      {hits.map((hit, index) => (
        <ProductHitCard
          imageLoadingStrategy={getImageLoadingStrategy(index)}
          key={hit.id}
          product={hit}
        />
      ))}
    </div>
  );
}

function getImageLoadingStrategy(
  index: number,
): Pick<CustomImageProps, 'loading' | 'fetchPriority'> | null {
  return index < 6
    ? ({
        loading: 'eager',
        fetchPriority: 'high',
      } as const)
    : null;
}
