import 'server-only';
import { client } from '../../lib/client';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { groq } from 'next-sanity';
import type { Header } from '@/sanity.types';
import { transformHeader } from './transformer';
import { executeQuery } from '@/sanity/lib/execute-query';
import { getCategoriesHierarchy } from '@/features/categories/services/queries';
import type { ExtractType } from '@/types';

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
        category {
          name,
          id
        }
      }
    }
  }
}[0]
`;

export async function getHeader(locale: string) {
  'use cache';

  cacheTag('header');

  const result = await executeQuery(
    async () => await client.fetch<Header>(HEADER_QUERY, { lang: locale }),
  );

  if (!result.success) {
    return result;
  }

  const rootCategoryIds = getRootCategoryIds(
    result.data.navigation?.navigationItems,
  );

  if (rootCategoryIds?.length) {
    const categoriesHierarchyResult = await getCategoriesHierarchy(
      locale,
      rootCategoryIds,
    );

    if (categoriesHierarchyResult.success) {
      return {
        success: result.success,
        data: transformHeader(result.data, categoriesHierarchyResult.data),
      };
    }
  }

  return {
    success: result.success,
    data: transformHeader(result.data, []),
  };
}

function getRootCategoryIds(
  navigationItems: ExtractType<Header, 'navigation.navigationItems'>,
): string[] {
  if (!navigationItems) return [];

  return navigationItems.flatMap((item) =>
    item._type !== 'navigationItem' && item.category?.id
      ? [item.category.id]
      : [],
  );
}
