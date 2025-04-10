import 'server-only';
import { client } from '../../lib/client';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { groq } from 'next-sanity';
import type { ContentPage } from '@/sanity.types';
import { executeQuery } from '@/sanity/lib/execute-query';
import { transformContentPage } from './transformer';

const CONTENT_PAGES_QUERY = groq`
*[_type == "contentPage" && language == $lang && slug.pageType == "content"]{
  title,
  "slug": slug.contentPageSlug,
  breadcrumb[] {
    label,
    url
  },
  seoMetadata {
    title,
    description,
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
    indexing,
  },
  blocks[] {
    _type == "fullScreenBanner" => {
      _key,
      _type,
      title, 
      description,
      tag,
      cta,
      image,
      contentAlignment,
      contentPosition
    },
    _type == "thinBanner" => {
      _key,
      _type,
      title, 
      description,
      tag,
      cta,
      image,
      contentAlignment
    },
    _type == "heroBanner" => {
      _key,
      _type,
      title, 
      description,
      tag,
      cta,
      image,
      layout
    },
    _type == "featureBlock" => {
      _key,
      _type,
      title, 
      features[] {
        icon,
        title,
        description
      }
    },
    _type == "categoryProductNewArrivals" => {
      _key,
      _type,
      category {
        category {
          id
        }
      }
    },
    _type == "recentlyViewedProducts" => {
      _key,
      _type
    }
  }
}
`;

export async function getContentPages(locale: string) {
  'use cache';

  cacheTag('content_pages');

  const result = await executeQuery(
    async () =>
      await client.fetch<ContentPage[]>(CONTENT_PAGES_QUERY, {
        lang: locale,
      }),
  );

  if (!result.success) {
    return result;
  }

  return {
    success: result.success,
    data: result.data.map(transformContentPage),
  };
}
