import type { Header } from '@/sanity-types';
import type {
  HeaderCategoryNavigationItem,
  HeaderDTO,
  HeaderTier1NavigationItem,
  HeaderTier2NavigationItem,
  HeaderTier3NavigationItem,
} from './types';
import type { ExtractType } from '@/types';

export function transformHeader(header: Header): HeaderDTO {
  const navigationItems =
    header.navigation?.navigationItems?.map((navigationItem) => {
      if (navigationItem._type === 'rootCategorySelect') {
        return transformCategoryNavigationItem(navigationItem);
      }

      return transformTier1NavigationItem(navigationItem);
    }) ?? [];

  return {
    navigation: {
      navigationItems:
        navigationItems.filter(
          (
            item,
          ): item is HeaderCategoryNavigationItem | HeaderTier1NavigationItem =>
            item !== null,
        ) ?? [],
    },
  };
}

function transformCategoryNavigationItem(
  navigationItem: ExtractType<Header, 'navigation.navigationItems[number]'>,
): HeaderCategoryNavigationItem | null {
  if (navigationItem._type !== 'rootCategorySelect') return null;

  return {
    type: 'categoryNavigationItem',
    id: navigationItem._type,
  };
}

function transformTier1NavigationItem(
  navigationItem: ExtractType<Header, 'navigation.navigationItems[number]'>,
): HeaderTier1NavigationItem | null {
  if (navigationItem._type !== 'navigationItem') return null;

  return {
    type: 'navigationItem',
    title: navigationItem.title,
    link: {
      url: navigationItem.link?.url ?? '',
      title: navigationItem.link?.title,
      newTab: navigationItem.link?.newTab ?? false,
    },
    promotionalBanner: {
      name: navigationItem.promotionalBanner?.name,
      description: navigationItem.promotionalBanner?.description,
      image: {
        url: navigationItem.promotionalBanner?.image?.image,
        alt: navigationItem.promotionalBanner?.image?.alt,
      },
      cta: {
        url: navigationItem.promotionalBanner?.cta?.url ?? '',
        title: navigationItem.promotionalBanner?.cta?.title,
        newTab: navigationItem.promotionalBanner?.cta?.newTab ?? false,
      },
    },
    children: navigationItem.children?.map(transformTier2NavigationItem) ?? [],
  };
}

function transformTier2NavigationItem(
  navigationItem: ExtractType<
    Header,
    'navigation.navigationItems[number].children[number]'
  >,
): HeaderTier2NavigationItem {
  return {
    title: navigationItem.title ?? '',
    link: {
      url: navigationItem.link?.url ?? '',
      title: navigationItem.link?.title,
      newTab: navigationItem.link?.newTab ?? false,
    },
    children: navigationItem.children?.map(transformTier3NavigationItem) ?? [],
  };
}

function transformTier3NavigationItem(
  navigationItem: ExtractType<
    Header,
    'navigation.navigationItems[number].children[number].children[number]'
  >,
): HeaderTier3NavigationItem {
  return {
    title: navigationItem.title,
    link: {
      url: navigationItem.link?.url ?? '',
      title: navigationItem.link?.title,
      newTab: navigationItem.link?.newTab ?? false,
    },
  };
}
