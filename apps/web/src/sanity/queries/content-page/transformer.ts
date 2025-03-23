import type { ContentPage } from '@/sanity.types';
import type {
  Block,
  BreadcrumbItem,
  ContentPageDTO,
  FullScreenBanner,
  SEOMetadata,
  ThinBanner,
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

function pickTransformBlock(data: ExtractType<ContentPage, 'blocks[number]'>) {
  switch (data._type) {
    case 'fullScreenBanner':
      return transformFullWidthBanner(data);
    case 'thinBanner':
      return transformThinBanner(data);
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
