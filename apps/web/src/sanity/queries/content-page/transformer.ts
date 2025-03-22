import type { ContentPage } from '@/sanity.types';
import type {
  Content,
  ContentPageDTO,
  FullWidthBanner,
  SEOMetadata,
} from './types';
import type { ExtractType } from '@/types';

export function transformContentPage(contentPage: ContentPage): ContentPageDTO {
  return {
    slug: contentPage.slug ?? '',
    seoMetadata: transformSeoMetadata(contentPage?.seoMetadata),
    content: transformContent(contentPage.content),
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

function transformContent(
  content: ExtractType<ContentPage, 'content'>,
): Content[] {
  return content?.map(pickTransformContent) ?? [];
}

function pickTransformContent(
  data: ExtractType<ContentPage, 'content[number]'>,
) {
  switch (data._type) {
    case 'fullWidthBanner':
      return transformFullWidthBanner(data);
    default:
      throw new Error(`Unimplemented type: ${data._type}`);
  }
}

function transformFullWidthBanner(
  fullWidthBanner: ExtractType<ContentPage, 'content[number]'>,
): FullWidthBanner {
  return {
    title: fullWidthBanner.title ?? '',
    description: fullWidthBanner.description ?? '',
    cta: {
      title: fullWidthBanner.cta?.title ?? '',
      url: fullWidthBanner.cta?.url ?? '',
      newTab: fullWidthBanner.cta?.newTab ?? false,
    },
    image: {
      url: fullWidthBanner.image?.image ?? '',
      alt: fullWidthBanner.image?.alt ?? '',
    },
    contentAlignment: fullWidthBanner.contentAlignment ?? 'center',
    contentPosition: fullWidthBanner.contentPosition ?? 'center',
  };
}
