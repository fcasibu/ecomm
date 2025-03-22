import type { Footer } from '@/sanity.types';
import type { FooterDTO, FooterNavigationItem } from './types';
import type { ExtractType } from '@/types';
import { isDefined } from '@ecomm/lib/is-defined';

export function transformFooter(footer: Footer): FooterDTO {
  return {
    navigation: {
      navigationItems:
        footer.navigation?.navigationItems
          ?.map(transformNavigationItem)
          .filter(isDefined) ?? [],
    },
  };
}

export function transformNavigationItem(
  navigationItem: ExtractType<Footer, 'navigation.navigationItems[number]'>,
): FooterNavigationItem {
  return {
    title: navigationItem.title,
    children:
      navigationItem.children?.filter(isDefined).map((item) => ({
        title: item.title ?? '',
        link: {
          title: item.link?.title ?? '',
          url: item.link?.url ?? '',
          newTab: item.link?.newTab ?? false,
        },
      })) ?? [],
  };
}
