import 'server-only';
import { client } from '../../lib/client';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { groq } from 'next-sanity';
import type { ContentPage } from '@/sanity.types';
import { executeQuery } from '@/sanity/lib/execute-query';
import { transformContentPage } from './transformer';

const CONTENT_PAGES_QUERY = groq`
*[_type == "contentPage" && language == $lang]{
  title,
  slug,
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
    _type == "fullWidthBanner" => {
      _key,
      _type,
      title, 
      description,
      cta,
      image,
      contentAlignment,
      contentPosition
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
