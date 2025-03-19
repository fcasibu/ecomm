import 'server-only';

import { client } from '../../lib/client';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { groq } from 'next-sanity';
import type { Footer } from '@/sanity.types';
import { transformFooter } from './transformer';
import { executeQuery } from '@/sanity/lib/execute-query';

const FOOTER_QUERY = groq`
*[_type == "footer" && language == $lang]{
  navigation {
    navigationItems[] {
        title,
        children[] {
          title,
          link
        }
    }
  }
}[0]
`;

export async function getFooter(locale: string) {
  'use cache';

  cacheTag('footer');

  return await executeQuery(
    async () => await client.fetch<Footer>(FOOTER_QUERY, { lang: locale }),
    transformFooter,
  );
}
