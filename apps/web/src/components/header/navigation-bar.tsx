'use client';

import { Text } from '@ecomm/ui/typography';
import { ConditionalLink, NextLink } from '../link';
import { Fragment, useEffect, useState } from 'react';
import type {
  HeaderCategoryNavigationItem,
  HeaderNavigation,
  HeaderPromotionalBanner,
  HeaderTier1NavigationItem,
  HeaderTier2NavigationItem,
} from '@/sanity/queries/header/types';
import type { CategoryHierarchy } from '@ecomm/services/categories/category-dto';
import { link } from '@/lib/utils/link-helper';
import { useScopedI18n } from '@/locales/client';
import { cn } from '@ecomm/ui/lib/utils';
import { ImageComponent } from '@ecomm/ui/image';
import { ChevronRight, Heart, Search, ShoppingCart } from 'lucide-react';
import { Button } from '@ecomm/ui/button';
import { usePathname } from 'next/navigation';

export function NavigationBar({
  navigation,
}: {
  navigation: HeaderNavigation | null | undefined;
}) {
  const [openedMenu, setOpenedMenu] = useState<number | null>(null);
  const { navigationItems } = navigation ?? {};
  const t = useScopedI18n('header.navigation');
  const pathname = usePathname();

  useEffect(() => {
    setOpenedMenu(null);
  }, [pathname]);

  return (
    <nav className="container hidden md:block">
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
                hidden={
                  openedMenu === null ||
                  index !== openedMenu ||
                  !item.children?.length
                }
                navItem={item}
              />
            </Fragment>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <Button
            aria-label={t('actions.search.open')}
            variant="none"
            size="icon"
            className="h-min w-min"
          >
            <Search aria-hidden />
          </Button>
          <Button
            aria-label={t('actions.wishlist.open')}
            variant="none"
            size="icon"
            className="h-min w-min"
          >
            <Heart aria-hidden />
          </Button>
          <Button
            aria-label={t('actions.cart.open')}
            variant="none"
            size="icon"
            className="h-min w-min"
          >
            <ShoppingCart aria-hidden />
          </Button>
        </div>
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
        'absolute left-0 top-full h-[300px] w-full overflow-y-auto border border-b-gray-300 bg-white pb-8 pt-4',
        {
          hidden,
        },
      )}
    >
      <div className="container px-8">
        {navItem.type === 'categoryNavigationItem' ? (
          <CategoryNavigationItemTier2
            promotionalBanner={navItem.promotionalBanner}
            tier2Items={navItem.children ?? []}
          />
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
  promotionalBanner,
}: {
  tier2Items: CategoryHierarchy[];
  promotionalBanner: HeaderPromotionalBanner | null | undefined;
}) {
  const sortedTier2Items = tier2Items.toSorted(
    (a, b) => (b.children?.length ?? 0) - (a.children?.length ?? 0),
  );

  return (
    <div className="flex gap-8">
      <div
        className={cn(
          'grid flex-1 gap-x-8 gap-y-6 md:grid-cols-3 lg:grid-cols-4',
          {
            'lg:grid-cols-5': !promotionalBanner,
          },
        )}
      >
        {sortedTier2Items.map((item) => (
          <ul key={item.id}>
            <li>
              <NextLink href={link.category.single(item.slug)}>
                <Text size="md" className="!font-semibold">
                  {item.name}
                </Text>
              </NextLink>
            </li>
            {item.children?.map((child) => (
              <li key={child.id}>
                <NextLink href={link.category.single(child.slug)} prefetch>
                  <Text as="span" size="sm">
                    {child.name}
                  </Text>
                </NextLink>
              </li>
            ))}
          </ul>
        ))}
      </div>
      {promotionalBanner && (
        <div className="max-h-max w-[200px] overflow-hidden rounded-lg border bg-gray-50">
          <ImageComponent
            alt={promotionalBanner.image?.alt ?? ''}
            src={promotionalBanner.image?.url}
            width={280}
            height={160}
            className="w-full object-cover"
          />
          <div className="flex flex-col gap-2 p-4">
            <div>
              <Text
                size="sm"
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

function NavigationItemTier2({
  tier2Items,
  promotionalBanner,
}: {
  tier2Items: HeaderTier2NavigationItem[];
  promotionalBanner: HeaderPromotionalBanner | null | undefined;
}) {
  const sortedTier2Items = tier2Items.toSorted(
    (a, b) => (b.children.length ?? 0) - (a.children.length ?? 0),
  );

  return (
    <div className="flex gap-8">
      <div
        className={cn(
          'grid flex-1 gap-x-8 gap-y-6 md:grid-cols-3 lg:grid-cols-4',
          {
            'lg:grid-cols-5': !promotionalBanner,
          },
        )}
      >
        {sortedTier2Items.map((item) => (
          <div key={item.title} className="min-w-[150px]">
            <ul>
              <li>
                <ConditionalLink href={item.link?.url} prefetch>
                  <Text size="md" className="mb-2 block !font-semibold">
                    {item.title}
                  </Text>
                </ConditionalLink>
              </li>
              {item.children?.map((child) => (
                <li key={child.title} className="mb-1">
                  <ConditionalLink href={child.link?.url} prefetch>
                    <Text as="span" size="sm">
                      {child.title}
                    </Text>
                  </ConditionalLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {promotionalBanner && (
        <div className="max-h-max w-[200px] overflow-hidden rounded-lg border bg-gray-50">
          <ImageComponent
            alt={promotionalBanner.image?.alt ?? ''}
            src={promotionalBanner.image?.url}
            width={280}
            height={160}
            className="w-full object-cover"
          />
          <div className="flex flex-col gap-2 p-4">
            <div>
              <Text
                size="sm"
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
