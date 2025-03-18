'use client';

import { Text } from '@ecomm/ui/typography';
import { ConditionalLink, NextLink } from '../link';
import { Fragment, useState } from 'react';
import type {
  HeaderCategoryNavigationItem,
  HeaderNavigation,
  HeaderTier1NavigationItem,
  HeaderTier2NavigationItem,
} from '@/sanity/queries/header/types';
import type { CategoryHierarchy } from '@ecomm/services/categories/category-dto';
import { link } from '@/lib/utils/link-helper';
import { useScopedI18n } from '@/locales/client';
import { cn } from '@ecomm/ui/lib/utils';
import { ImageComponent } from '@ecomm/ui/image';
import { ChevronRight } from 'lucide-react';

export function NavigationBar({
  navigation,
}: {
  navigation: HeaderNavigation | null | undefined;
}) {
  const [openedMenu, setOpenedMenu] = useState<number | null>(null);
  const { navigationItems } = navigation ?? {};
  const t = useScopedI18n('navigation');

  return (
    <nav className="container hidden shadow md:block">
      <div className="flex items-center justify-between">
        <NextLink href={link.home} className="py-4 hover:no-underline">
          <Text className="!font-bold">{t('title')}</Text>
        </NextLink>
        <ul
          className="flex gap-4 py-4"
          onMouseLeave={() => setOpenedMenu(null)}
        >
          {navigationItems?.map((item, index) => (
            <Fragment key={`${item.type}-${index}`}>
              {item.type === 'categoryNavigationItem' ? (
                <CategoryNavigationItem
                  navigationItem={item}
                  onMouseEnter={() => setOpenedMenu(index)}
                />
              ) : (
                <NavigationItemTier1
                  navigationItem={item}
                  onMouseEnter={() => setOpenedMenu(index)}
                />
              )}
              <Megamenu
                hidden={openedMenu === null || index !== openedMenu}
                navItem={item}
              />
            </Fragment>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function Megamenu({
  hidden,
  navItem,
}: {
  hidden: boolean;
  navItem: HeaderTier1NavigationItem | HeaderCategoryNavigationItem;
}) {
  return (
    <div
      className={cn(
        'absolute left-0 top-full h-[300px] w-full overflow-y-auto bg-white pb-8 pt-0 shadow',
        {
          hidden,
        },
      )}
    >
      <div className="container px-8">
        {navItem.type === 'categoryNavigationItem' ? (
          <CategoryNavigationItemTier2 tier2Items={navItem.children ?? []} />
        ) : (
          <NavigationItemTier2
            promotionalBanner={navItem.promotionalBanner}
            tier2Items={navItem.children ?? []}
          />
        )}
      </div>
    </div>
  );
}

function CategoryNavigationItemTier2({
  tier2Items,
}: {
  tier2Items: CategoryHierarchy[];
}) {
  const sortedTier2Items = tier2Items.toSorted(
    (a, b) => (b.children?.length ?? 0) - (a.children?.length ?? 0),
  );

  return (
    <div className="flex flex-wrap gap-16 gap-y-1">
      {sortedTier2Items.map((item) => (
        <ul key={item.id}>
          <NextLink href={link.category.single(item.slug)}>
            <Text size="sm" className="!font-semibold">
              {item.name}
            </Text>
          </NextLink>
          {item.children?.map((child) => (
            <li key={child.id}>
              <NextLink href={link.category.single(child.slug)} prefetch>
                <Text as="span" size="xs">
                  {child.name}
                </Text>
              </NextLink>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

function NavigationItemTier2({
  tier2Items,
  promotionalBanner,
}: {
  tier2Items: HeaderTier2NavigationItem[];
  promotionalBanner: HeaderTier1NavigationItem['promotionalBanner'];
}) {
  const sortedTier2Items = tier2Items.toSorted(
    (a, b) => (b.children.length ?? 0) - (a.children.length ?? 0),
  );

  return (
    <div className="flex">
      <div className="flex flex-1 flex-wrap gap-16 gap-y-1">
        {sortedTier2Items.map((item) => (
          <ul key={item.title}>
            <ConditionalLink href={item.link?.url} prefetch>
              <Text size="sm" className="!font-semibold">
                {item.title}
              </Text>
            </ConditionalLink>
            {item.children?.map((child) => (
              <li key={child.title}>
                <ConditionalLink href={child.link?.url} prefetch>
                  <Text as="span" size="xs">
                    {child.title}
                  </Text>
                </ConditionalLink>
              </li>
            ))}
          </ul>
        ))}
      </div>
      {promotionalBanner && (
        <div className="ml-auto max-h-max min-h-[200px] max-w-[200px] flex-1 overflow-hidden rounded-lg border bg-gray-50">
          <ImageComponent
            alt={promotionalBanner.image?.alt ?? ''}
            src={promotionalBanner.image?.url}
            width={200}
            height={130}
            className="w-full"
          />
          <div className="flex flex-col gap-4 p-3">
            <div>
              <Text
                size="xs"
                className="line-clamp-2 text-pretty break-words !font-bold"
              >
                {promotionalBanner.name}
              </Text>
              <Text className="line-clamp-3 text-pretty break-words !text-[0.6rem]">
                {promotionalBanner.description}
              </Text>
            </div>
            <ConditionalLink
              newTab={promotionalBanner.cta?.newTab}
              href={promotionalBanner.cta?.url}
              className="w-max"
            >
              <Text
                as="span"
                size="xs"
                className="flex items-center !font-semibold"
              >
                {promotionalBanner.cta?.title}
                <ChevronRight size={10} />
              </Text>
            </ConditionalLink>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryNavigationItem({
  navigationItem,
  onMouseEnter,
}: {
  navigationItem: HeaderCategoryNavigationItem;
  onMouseEnter: () => void;
}) {
  return (
    <li onMouseEnter={onMouseEnter}>
      <ConditionalLink href={navigationItem.slug} prefetch>
        <Text as="span">{navigationItem.name}</Text>
      </ConditionalLink>
    </li>
  );
}

function NavigationItemTier1({
  navigationItem,
  onMouseEnter,
}: {
  navigationItem: HeaderTier1NavigationItem;
  onMouseEnter: () => void;
}) {
  return (
    <li onMouseEnter={onMouseEnter}>
      <ConditionalLink href={navigationItem.link?.url} prefetch>
        <Text as="span">{navigationItem.title}</Text>
      </ConditionalLink>
    </li>
  );
}
