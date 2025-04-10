import type { ComponentType } from 'react';
import type {
  Block,
  BlockKeys,
  ContentPageDTO,
} from '@/sanity/queries/content-page/types';
import { FullScreenBanner } from '../blocks/full-screen-banner';
import { Spacer } from '../spacer';
import { ContentPageBreadcrumb } from '../breadcrumbs/content-page-breadcrumb';
import { ThinBanner } from '../blocks/thin-banner';
import { HeroBanner } from '../blocks/hero-banner';
import { FeatureBlock } from '../blocks/feature-block';
import type { CustomImageProps } from '@ecomm/ui/image';
import { CategoryProductNewArrivals } from '../blocks/category-product-new-arrivals';
import { RecentlyViewedProducts } from '@/features/products/components/recently-viewed-products';
import type { CategoryDTO } from '@ecomm/services/categories/category-dto';
import { CategoryHeading } from '@/features/categories/components/category-heading';
import { SubCategories } from '@/features/categories/components/product-subcategories';

const BLOCKS: Record<
  BlockKeys,
  ComponentType<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    sku?: string;
    imageLoadingStrategy?: Pick<
      CustomImageProps,
      'loading' | 'fetchPriority'
    > | null;
  }>
> = {
  fullScreenBanner: FullScreenBanner,
  thinBanner: ThinBanner,
  heroBanner: HeroBanner,
  featureBlock: FeatureBlock,
  categoryProductNewArrivals: CategoryProductNewArrivals,
  recentlyViewedProducts: RecentlyViewedProducts,
};

const BLOCKS_WITH_NO_SPACING: BlockKeys[] = ['fullScreenBanner'];

export function ContentPage({ contentPage }: { contentPage: ContentPageDTO }) {
  if (!contentPage.blocks.length) return null;

  return (
    <>
      <ContentPageBreadcrumb data={contentPage.breadcrumb} />
      {contentPage.blocks.map((block, index) => {
        const Component = BLOCKS[block.type];

        if (!Component) return null;

        const hasSpacing = !BLOCKS_WITH_NO_SPACING.includes(block.type);

        const imageLoadingStrategy = getImageLoadingStrategy(
          contentPage.blocks,
          index,
        );

        return (
          <Spacer
            size="xl"
            key={block.key}
            top={!hasSpacing}
            bottom={!hasSpacing}
          >
            <Component
              data={block}
              imageLoadingStrategy={imageLoadingStrategy}
            />
          </Spacer>
        );
      })}
    </>
  );
}

export function CategoryContentPage({
  contentPage,
  category,
}: {
  contentPage: ContentPageDTO;
  category: CategoryDTO | null | undefined;
}) {
  return (
    <>
      {category && (
        <div className="container flex flex-col gap-3 py-8">
          <CategoryHeading category={category} />
          <SubCategories subCategories={category.children ?? []} />
        </div>
      )}
      {contentPage.blocks.map((block, index) => {
        const Component = BLOCKS[block.type];

        if (!Component) return null;

        const hasSpacing = !BLOCKS_WITH_NO_SPACING.includes(block.type);

        const imageLoadingStrategy = getImageLoadingStrategy(
          contentPage.blocks,
          index,
        );

        return (
          <Spacer
            size="xl"
            key={block.key}
            top={!hasSpacing}
            bottom={!hasSpacing}
          >
            <Component
              data={block}
              imageLoadingStrategy={imageLoadingStrategy}
            />
          </Spacer>
        );
      })}
    </>
  );
}

const LARGE_BLOCKS_WITH_IMAGE: BlockKeys[] = ['fullScreenBanner', 'heroBanner'];
const ABOVE_THE_FOLD_THRESHOLD = 3;
const HIGH_PRIORITY_LOADING = {
  loading: 'eager',
  fetchPriority: 'high',
} as const;

function getImageLoadingStrategy(
  blocks: Block[],
  index: number,
): Pick<CustomImageProps, 'loading' | 'fetchPriority'> | null {
  const firstBlockType = blocks[0]?.type;
  const secondBlockType = blocks[1]?.type;

  const isLargeBlockWithImage = (blockType?: string): boolean => {
    return (
      blockType !== undefined &&
      LARGE_BLOCKS_WITH_IMAGE.includes(blockType as BlockKeys)
    );
  };

  if (index === 0 && isLargeBlockWithImage(firstBlockType)) {
    return HIGH_PRIORITY_LOADING;
  }

  if (isLargeBlockWithImage(secondBlockType)) {
    const isAboveTheLargeBlock =
      index < 2 && !isLargeBlockWithImage(firstBlockType);
    return isAboveTheLargeBlock ? HIGH_PRIORITY_LOADING : null;
  }

  const isAboveTheFold = index < ABOVE_THE_FOLD_THRESHOLD;
  const isNotFollowingLargeBlock = !isLargeBlockWithImage(firstBlockType);

  return isAboveTheFold && isNotFollowingLargeBlock
    ? HIGH_PRIORITY_LOADING
    : null;
}
