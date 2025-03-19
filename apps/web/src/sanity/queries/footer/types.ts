import type { Link } from '../common/types';

export interface FooterDTO {
  navigation: FooterNavigation;
}

export interface FooterNavigation {
  navigationItems: FooterNavigationItem[];
}

export interface FooterNavigationItem {
  title: string | null | undefined;
  children: FooterNavigationItemChild[];
}

export interface FooterNavigationItemChild {
  title: string | null | undefined;
  link: Link | null | undefined;
}
