import 'server-only';
import { client } from '../../lib/client';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { groq } from 'next-sanity';
import type { Header } from '@/sanity-types';
import { transformHeader } from './transformer';

const HEADER_QUERY = groq`
*[_type == "header" && language == $lang]{
  navigation {
    navigationItems[] {
      _type == "navigationItem" => {
        _type,
        title,
        link,
        promotionalBanner {
          name,
          description,
          image,
          cta
        },
        children[] {
          title,
          link,
          children[] {
            title,
            link
          }
        }
      },
      _type == "categoryNavigationItem" => {
        _type,
        id
      }
    }
  }
}[0]
`;

// no way sanity has this shitty
export async function getHeader(locale: string) {
  'use cache';

  cacheTag('header');

  const header = await client.fetch<Header>(HEADER_QUERY, { lang: locale });
  return transformHeader(header);
}
