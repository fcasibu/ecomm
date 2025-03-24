import type { ContentPage } from '@/sanity.types';
import type {
  Block,
  BreadcrumbItem,
  ContentPageDTO,
  FullScreenBanner,
  HeroBanner,
  SEOMetadata,
  ThinBanner,
  FeatureBlock,
  FeatureItem,
  CategoryNewArrivalsCarousel,
  RecentlyViewedProductsCarousel,
} from './types';
import type { ExtractType } from '@/types';
import assert from 'node:assert';
import { isDefined } from '@ecomm/lib/is-defined';

export function transformContentPage(contentPage: ContentPage): ContentPageDTO {
  return {
    slug: contentPage.slug ?? '',
    breadcrumb: transformBreadcrumb(contentPage.breadcrumb),
    seoMetadata: transformSeoMetadata(contentPage?.seoMetadata),
    blocks: transformBlocks(contentPage.blocks),
  };
}

function transformBreadcrumb(
  breadcrumb: ExtractType<ContentPage, 'breadcrumb'>,
): BreadcrumbItem[] {
  return breadcrumb?.map(transformBreadcrumbItem) ?? [];
}

function transformBreadcrumbItem(
  item: ExtractType<ContentPage, 'breadcrumb[number]'>,
): BreadcrumbItem {
  return {
    link: {
      title: item.url?.title ?? '',
      url: item.url?.url ?? '',
      newTab: item.url?.newTab ?? false,
    },
    label: item.label ?? '',
  };
}

function transformSeoMetadata(
  metadata: ExtractType<ContentPage, 'seoMetadata'>,
): SEOMetadata {
  return {
    title: metadata?.title ?? '',
    description: metadata?.description ?? '',
    ogTitle: metadata?.ogTitle ?? '',
    ogDescription: metadata?.ogDescription ?? '',
    twitterTitle: metadata?.twitterTitle ?? '',
    twitterDescription: metadata?.twitterDescription ?? '',
    indexing: metadata?.indexing ?? '',
  };
}

function transformBlocks(blocks: ExtractType<ContentPage, 'blocks'>): Block[] {
  return blocks?.map(pickTransformBlock).filter(isDefined) ?? [];
}

function pickTransformBlock(
  data: ExtractType<ContentPage, 'blocks[number]'>,
): Block {
  switch (data._type) {
    case 'fullScreenBanner':
      return transformFullWidthBanner(data);
    case 'thinBanner':
      return transformThinBanner(data);
    case 'heroBanner':
      return transformHeroBanner(data);
    case 'featureBlock':
      return transformFeatureBlock(data);
    case 'categoryProductNewArrivals':
      return transformCategorySpecificNewArrivals(data);
    case 'recentlyViewedProducts':
      return transformRecentlyViewedProducts(data);
  }
}

function transformFullWidthBanner(
  fullScreenBanner: ExtractType<ContentPage, 'blocks[number]'>,
): FullScreenBanner {
  assert(fullScreenBanner._type === 'fullScreenBanner');

  return {
    key: fullScreenBanner._key,
    type: fullScreenBanner._type,
    title: {
      value: fullScreenBanner.title?.title ?? '',
      type: fullScreenBanner.title?.type ?? 'h2',
      textColor: fullScreenBanner.title?.textColor?.hex ?? '',
    },
    description: {
      value: fullScreenBanner.description?.value ?? '',
      textColor: fullScreenBanner.description?.textColor?.hex ?? '',
    },
    tag: {
      value: fullScreenBanner.tag?.value ?? '',
      textColor: fullScreenBanner.tag?.textColor?.hex ?? '',
    },
    cta: {
      title: fullScreenBanner.cta?.title ?? '',
      url: fullScreenBanner.cta?.url ?? '',
      newTab: fullScreenBanner.cta?.newTab ?? false,
    },
    image: {
      url: fullScreenBanner.image?.image ?? '',
      alt: fullScreenBanner.image?.alt ?? '',
    },
    contentAlignment: fullScreenBanner.contentAlignment ?? 'center',
    contentPosition: fullScreenBanner.contentPosition ?? 'center',
  };
}

function transformThinBanner(
  thinBanner: ExtractType<ContentPage, 'blocks[number]'>,
): ThinBanner {
  assert(thinBanner._type === 'thinBanner');

  return {
    key: thinBanner._key,
    type: thinBanner._type,
    title: {
      value: thinBanner.title?.title ?? '',
      type: thinBanner.title?.type ?? 'h2',
      textColor: thinBanner.title?.textColor?.hex ?? '',
    },
    description: {
      value: thinBanner.description?.value ?? '',
      textColor: thinBanner.description?.textColor?.hex ?? '',
    },
    tag: {
      value: thinBanner.tag?.value ?? '',
      textColor: thinBanner.tag?.textColor?.hex ?? '',
    },
    cta: {
      title: thinBanner.cta?.title ?? '',
      url: thinBanner.cta?.url ?? '',
      newTab: thinBanner.cta?.newTab ?? false,
    },
    image: {
      url: thinBanner.image?.image ?? '',
      alt: thinBanner.image?.alt ?? '',
    },
    contentAlignment: thinBanner.contentAlignment ?? 'left',
  };
}

function transformHeroBanner(
  heroBanner: ExtractType<ContentPage, 'blocks[number]'>,
): HeroBanner {
  assert(heroBanner._type === 'heroBanner');

  return {
    key: heroBanner._key,
    type: heroBanner._type,
    title: {
      value: heroBanner.title?.title ?? '',
      type: heroBanner.title?.type ?? 'h2',
      textColor: heroBanner.title?.textColor?.hex ?? '',
    },
    description: {
      value: heroBanner.description?.value ?? '',
      textColor: heroBanner.description?.textColor?.hex ?? '',
    },
    tag: {
      value: heroBanner.tag?.value ?? '',
      textColor: heroBanner.tag?.textColor?.hex ?? '',
    },
    cta: {
      title: heroBanner.cta?.title ?? '',
      url: heroBanner.cta?.url ?? '',
      newTab: heroBanner.cta?.newTab ?? false,
    },
    image: {
      url: heroBanner.image?.image ?? '',
      alt: heroBanner.image?.alt ?? '',
    },
    layout: heroBanner.layout ?? 'image-left',
  };
}

function transformFeatureBlock(
  featureBlock: ExtractType<ContentPage, 'blocks[number]'>,
): FeatureBlock {
  assert(featureBlock._type === 'featureBlock');

  return {
    key: featureBlock._key,
    type: featureBlock._type,
    title: {
      value: featureBlock.title?.title ?? '',
      type: featureBlock.title?.type ?? 'h2',
      textColor: featureBlock.title?.textColor?.hex ?? '',
    },
    features: featureBlock.features?.map(transformFeatureItem) ?? [],
  };
}

function transformFeatureItem(
  featureItem: ExtractType<ContentPage, 'blocks[number].features[number]'>,
): FeatureItem {
  return {
    title: featureItem.title ?? '',
    description: featureItem.description ?? '',
    icon: {
      url: featureItem.icon?.image ?? '',
      alt: featureItem.icon?.alt ?? '',
    },
  };
}
function transformCategorySpecificNewArrivals(
  categoryNewArrivals: ExtractType<ContentPage, 'blocks[number]'>,
): CategoryNewArrivalsCarousel {
  assert(categoryNewArrivals._type === 'categoryProductNewArrivals');

  return {
    key: categoryNewArrivals._key,
    type: categoryNewArrivals._type,
    categoryId: categoryNewArrivals.category?.category?.id ?? '',
  };
}

function transformRecentlyViewedProducts(
  recentlyViewedProducts: ExtractType<ContentPage, 'blocks[number]'>,
): RecentlyViewedProductsCarousel {
  return {
    key: recentlyViewedProducts._key,
    type: recentlyViewedProducts._type,
  };
}
