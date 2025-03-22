import type { ContentPage } from '@/sanity.types';
import type {
  Block,
  ContentPageDTO,
  FullScreenBanner,
  SEOMetadata,
} from './types';
import type { ExtractType } from '@/types';

export function transformContentPage(contentPage: ContentPage): ContentPageDTO {
  return {
    slug: contentPage.slug ?? '',
    seoMetadata: transformSeoMetadata(contentPage?.seoMetadata),
    blocks: transformBlocks(contentPage.blocks),
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
  return blocks?.map(pickTransformBlock) ?? [];
}

function pickTransformBlock(data: ExtractType<ContentPage, 'blocks[number]'>) {
  switch (data._type) {
    case 'fullScreenBanner':
      return transformFullWidthBanner(data);
  }
}

function transformFullWidthBanner(
  fullScreenBanner: ExtractType<ContentPage, 'blocks[number]'>,
): FullScreenBanner {
  return {
    key: fullScreenBanner._key,
    type: fullScreenBanner._type,
    title: {
      value: fullScreenBanner.title?.title ?? '',
      type: fullScreenBanner.title?.type ?? 'h2',
      textColor: fullScreenBanner.title?.textColor?.hex ?? 'h2',
    },
    description: {
      value: fullScreenBanner.description?.value ?? '',
      textColor: fullScreenBanner.description?.textColor?.hex ?? '',
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
