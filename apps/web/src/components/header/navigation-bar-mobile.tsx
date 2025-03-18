'use client';

import { useCurrentLocale, useScopedI18n } from '@/locales/client';
import type {
  HeaderCategoryNavigationItem,
  HeaderNavigation,
  HeaderTier1NavigationItem,
  HeaderTier2NavigationItem,
} from '@/sanity/queries/header/types';
import { Button } from '@ecomm/ui/button';
import { Globe, Heart, Menu, Search, ShoppingCart, X } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@ecomm/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ecomm/ui/accordion';
import type { CategoryHierarchy } from '@ecomm/services/categories/category-dto';
import { ConditionalLink, NextLink } from '../link';
import { isDefined } from '@ecomm/lib/is-defined';
import { link } from '@/lib/utils/link-helper';
import { usePathname, useRouter } from 'next/navigation';
import { Text } from '@ecomm/ui/typography';
import { Badge } from '@ecomm/ui/badge';
import { useWindowInfo } from '@faceless-ui/window-info';

export function NavigationBarMobile({
  navigation,
}: {
  navigation: HeaderNavigation | null | undefined;
}) {
  const { navigationItems } = navigation ?? {};
  const t = useScopedI18n('navigation');

  return (
    <nav className="container flex justify-end gap-3 py-4 shadow md:hidden">
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
      <NavigationMenu navigationItems={navigationItems ?? []} />
    </nav>
  );
}

function NavigationMenu({
  navigationItems,
}: {
  navigationItems: HeaderNavigation['navigationItems'];
}) {
  const windowInfo = useWindowInfo();
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const t = useScopedI18n('navigation');

  const filteredNavigationItems = navigationItems.filter(isDefined);
  const pathname = usePathname();

  useEffect(() => {
    setIsNavMenuOpen(false);
  }, [pathname]);

  return (
    <Sheet
      open={!windowInfo.breakpoints.m && isNavMenuOpen}
      onOpenChange={setIsNavMenuOpen}
    >
      <SheetTrigger asChild>
        <Button
          aria-label={
            isNavMenuOpen ? t('actions.menu.close') : t('actions.menu.open')
          }
          variant="none"
          size="icon"
          className="h-min w-min"
        >
          {isNavMenuOpen ? <X /> : <Menu aria-hidden />}
        </Button>
      </SheetTrigger>
      <SheetContent
        className="sticky top-0 flex h-screen w-full max-w-full flex-col overflow-y-auto px-4 pt-10"
        side="right"
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        {isNavMenuOpen &&
          filteredNavigationItems.map((navigationItem, index) => (
            <Fragment key={`${navigationItem.type}-${index}`}>
              {navigationItem.type === 'categoryNavigationItem' ? (
                <Accordion type="multiple">
                  <CategoryNavigationItemTier1
                    navigationItem={navigationItem}
                  />
                </Accordion>
              ) : (
                <Accordion type="multiple">
                  <NavigationItemTier1 navigationItem={navigationItem} />
                </Accordion>
              )}
            </Fragment>
          ))}
        <NavigationMenuFooter />
      </SheetContent>
    </Sheet>
  );
}

function NavigationMenuFooter() {
  const t = useScopedI18n('navigation.menu');
  const locale = useCurrentLocale();
  const lang = locale.split('-')[0];

  return (
    <div className="mt-auto space-y-4">
      <div className="flex flex-col gap-2">
        <Button type="button" variant="outline" asChild>
          <NextLink href={link.auth.signIn}>{t('actions.signIn')}</NextLink>
        </Button>
        <Button type="button">
          <NextLink href={link.auth.joinUs}>{t('actions.joinUs')}</NextLink>
        </Button>
      </div>
      <div className="flex justify-between">
        <NextLink href={link.help}>
          <Text as="span" size="sm">
            {t('help')}
          </Text>
        </NextLink>
        <Badge variant="outline">
          <Text size="sm" className="flex items-center gap-1">
            <Globe size={12} />
            {lang?.toUpperCase()}
          </Text>
        </Badge>
      </div>
    </div>
  );
}

function NavigationItemTier1({
  navigationItem,
}: {
  navigationItem: HeaderTier1NavigationItem;
}) {
  const router = useRouter();

  if (!navigationItem.title) return null;

  return (
    <AccordionItem value={navigationItem.title}>
      <AccordionTrigger
        className="py-2"
        isEmpty={!navigationItem.children.length}
      >
        <span
          onClick={(e) => {
            e.stopPropagation();
            if (!navigationItem.link?.url) return;

            router.push(navigationItem.link.url);
          }}
        >
          {navigationItem.title}
        </span>
      </AccordionTrigger>
      {Boolean(navigationItem.children.length) && (
        <AccordionContent className="pl-4">
          <NavigationItemTier2 tier2Items={navigationItem.children} />
        </AccordionContent>
      )}
    </AccordionItem>
  );
}

function NavigationItemTier2({
  tier2Items,
}: {
  tier2Items: HeaderTier2NavigationItem[];
}) {
  const router = useRouter();

  if (!tier2Items.length) return null;

  const filteredItems = tier2Items.filter(
    (item): item is NonNullable<typeof item> & { title: string } =>
      isDefined(item) && Boolean(item.title),
  );

  return (
    <Accordion type="multiple">
      {filteredItems.map((item) => (
        <AccordionItem value={item.title} key={item.title}>
          <AccordionTrigger
            className="py-2 text-xs"
            isEmpty={!item.children.length}
          >
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (!item.link?.url) return;

                router.push(item.link.url);
              }}
            >
              {item.title}
            </span>
          </AccordionTrigger>
          {Boolean(item.children.length) && (
            <AccordionContent className="flex flex-col gap-2 pl-4">
              {item.children.map((child) => (
                <Fragment key={child.title}>
                  <ConditionalLink
                    href={child.link?.url}
                    className="text-[0.7rem]"
                    prefetch
                  >
                    <span>{child.title}</span>
                  </ConditionalLink>
                </Fragment>
              ))}
            </AccordionContent>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function CategoryNavigationItemTier1({
  navigationItem,
}: {
  navigationItem: HeaderCategoryNavigationItem;
}) {
  const router = useRouter();

  return (
    <AccordionItem value={navigationItem.name}>
      <AccordionTrigger
        className="py-2"
        isEmpty={!navigationItem.children?.length}
      >
        <span
          onClick={(e) => {
            e.stopPropagation();
            router.push(link.category.single(navigationItem.slug ?? ''));
          }}
        >
          {navigationItem.name}
        </span>
      </AccordionTrigger>
      {Boolean(navigationItem.children?.length) && (
        <AccordionContent className="pl-4">
          <CategoryNavigationItemTier2
            tier2Items={navigationItem.children ?? []}
          />
        </AccordionContent>
      )}
    </AccordionItem>
  );
}

function CategoryNavigationItemTier2({
  tier2Items,
}: {
  tier2Items: CategoryHierarchy[];
}) {
  const router = useRouter();

  if (!tier2Items.length) return null;

  return (
    <Accordion type="multiple">
      {tier2Items.map((tier2Item) => (
        <AccordionItem value={tier2Item.name} key={tier2Item.id}>
          <AccordionTrigger
            className="py-2 text-xs"
            isEmpty={!tier2Item.children?.length}
          >
            <span
              onClick={(e) => {
                e.stopPropagation();
                router.push(link.category.single(tier2Item.slug));
              }}
            >
              {tier2Item.name}
            </span>
          </AccordionTrigger>
          {Boolean(tier2Item.children?.length) && (
            <AccordionContent className="flex flex-col gap-2 pl-4">
              {tier2Item.children?.map((item) => (
                <NextLink
                  key={item.id}
                  href={link.category.single(item.slug)}
                  className="text-[0.7rem]"
                  prefetch
                >
                  {item.name}
                </NextLink>
              ))}
            </AccordionContent>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
