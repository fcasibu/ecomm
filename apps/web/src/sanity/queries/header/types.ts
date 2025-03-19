import type { CategoryDTO } from '@ecomm/services/categories/category-dto';
import type { CustomImage, Link } from '../common/types';

export interface HeaderDTO {
  navigation: HeaderNavigation;
}

export interface HeaderNavigation {
  navigationItems: (HeaderTier1NavigationItem | HeaderCategoryNavigationItem)[];
}

export interface HeaderTier1NavigationItem {
  type: 'navigationItem';
  title: string | null | undefined;
  link: Link | null | undefined;
  promotionalBanner: HeaderPromotionalBanner | null | undefined;
  children: HeaderTier2NavigationItem[];
}

export interface HeaderTier2NavigationItem {
  title: string | null | undefined;
  link: Link | null | undefined;
  children: HeaderTier3NavigationItem[];
}

export interface HeaderTier3NavigationItem {
  title: string | null | undefined;
  link: Link | null | undefined;
}

export interface HeaderPromotionalBanner {
  name: string | null | undefined;
  description: string | null | undefined;
  image: CustomImage | null | undefined;
  cta: Link | null | undefined;
}

export interface HeaderCategoryNavigationItem extends Partial<CategoryDTO> {
  type: 'categoryNavigationItem';
  id: string;
  name: string;
  promotionalBanner: HeaderPromotionalBanner | null | undefined;
}
