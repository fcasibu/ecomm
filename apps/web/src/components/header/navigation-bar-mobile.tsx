'use client';

import { useCurrentLocale, useScopedI18n } from '@/locales/client';
import type {
  HeaderCategoryNavigationItem,
  HeaderNavigation,
  HeaderTier1NavigationItem,
  HeaderTier2NavigationItem,
} from '@/sanity/queries/header/types';
import { Button } from '@ecomm/ui/button';
import { Globe, Menu } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import type { CategoryHierarchy } from '@ecomm/services/categories/category-dto';
import { ConditionalLink, NextLink } from '../link';
import { isDefined } from '@ecomm/lib/is-defined';
import { link } from '@/lib/utils/link-helper';
import { usePathname, useRouter } from 'next/navigation';
import { Text } from '@ecomm/ui/typography';
import { Badge } from '@ecomm/ui/badge';
import { useWindowResize } from '@ecomm/ui/hooks/use-window-resize';
import { dynamicImport } from '@/lib/utils/dynamic-import';

const AccordionComponents = dynamicImport(
  () => import('@ecomm/ui/accordion'),
  {
    Accordion: null,
    AccordionItem: null,
    AccordionContent: null,
    AccordionTrigger: null,
  },
  { ssr: false },
);

const SheetComponents = dynamicImport(
  () => import('@ecomm/ui/sheet'),
  {
    Sheet: null,
    SheetContent: null,
    SheetTitle: null,
    SheetTrigger: null,
  },
  {
    ssr: false,
  },
);

export function NavigationBarMobile({
  navigation,
  actionComponents,
}: {
  navigation: HeaderNavigation | null | undefined;
  actionComponents: React.ReactNode;
}) {
  const { navigationItems } = navigation ?? {};
  const t = useScopedI18n('header.navigation');

  return (
    <nav className="container flex items-center justify-between py-4 md:hidden">
      <NextLink href={link.home} className="hover:no-underline">
        <Text className="!font-bold">{t('title')}</Text>
      </NextLink>
      <div className="flex items-center justify-end gap-3">
        {actionComponents}
        <NavigationMenu navigationItems={navigationItems ?? []} />
      </div>
    </nav>
  );
}

function NavigationMenu({
  navigationItems,
}: {
  navigationItems: HeaderNavigation['navigationItems'];
}) {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const t = useScopedI18n('header.navigation');
  const { width } = useWindowResize();

  const filteredNavigationItems = navigationItems.filter(isDefined);
  const pathname = usePathname();

  useEffect(() => {
    setIsNavMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (width && width >= 768) {
      setIsNavMenuOpen(false);
    }
  }, [width]);

  return (
    <>
      <Button
        aria-label={t('actions.menu.open')}
        variant="none"
        size="icon"
        className="h-min w-min"
        onClick={() => setIsNavMenuOpen(true)}
      >
        <Menu aria-hidden />
      </Button>
      {isNavMenuOpen && (
        <SheetComponents.Sheet
          open={isNavMenuOpen}
          onOpenChange={setIsNavMenuOpen}
        >
          <SheetComponents.SheetContent
            className="sticky top-0 flex h-screen w-full max-w-full flex-col overflow-y-auto px-4 pt-10"
            side="right"
          >
            <SheetComponents.SheetTitle className="sr-only">
              Menu
            </SheetComponents.SheetTitle>
            {filteredNavigationItems.map((navigationItem, index) => (
              <Fragment key={`${navigationItem.type}-${index}`}>
                {navigationItem.type === 'categoryNavigationItem' ? (
                  <AccordionComponents.Accordion type="multiple">
                    <CategoryNavigationItemTier1
                      navigationItem={navigationItem}
                    />
                  </AccordionComponents.Accordion>
                ) : (
                  <AccordionComponents.Accordion type="multiple">
                    <NavigationItemTier1 navigationItem={navigationItem} />
                  </AccordionComponents.Accordion>
                )}
              </Fragment>
            ))}
            <NavigationMenuFooter />
          </SheetComponents.SheetContent>
        </SheetComponents.Sheet>
      )}
    </>
  );
}

function NavigationMenuFooter() {
  const t = useScopedI18n('header.menu');
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
            <span>{lang?.toUpperCase()}</span>
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
    <AccordionComponents.AccordionItem value={navigationItem.title}>
      <AccordionComponents.AccordionTrigger
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
      </AccordionComponents.AccordionTrigger>
      {Boolean(navigationItem.children.length) && (
        <AccordionComponents.AccordionContent className="pl-4">
          <NavigationItemTier2 tier2Items={navigationItem.children} />
        </AccordionComponents.AccordionContent>
      )}
    </AccordionComponents.AccordionItem>
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
    <AccordionComponents.Accordion type="multiple">
      {filteredItems.map((item) => (
        <AccordionComponents.AccordionItem value={item.title} key={item.title}>
          <AccordionComponents.AccordionTrigger
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
          </AccordionComponents.AccordionTrigger>
          {Boolean(item.children.length) && (
            <AccordionComponents.AccordionContent className="flex flex-col gap-2 pl-4">
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
            </AccordionComponents.AccordionContent>
          )}
        </AccordionComponents.AccordionItem>
      ))}
    </AccordionComponents.Accordion>
  );
}

function CategoryNavigationItemTier1({
  navigationItem,
}: {
  navigationItem: HeaderCategoryNavigationItem;
}) {
  const locale = useCurrentLocale();
  const router = useRouter();

  return (
    <AccordionComponents.AccordionItem value={navigationItem.name}>
      <AccordionComponents.AccordionTrigger
        className="py-2"
        isEmpty={!navigationItem.children?.length}
      >
        <span
          onClick={(e) => {
            e.stopPropagation();
            router.push(
              `/${locale}${link.category.single(navigationItem.slug ?? '')}`,
            );
          }}
        >
          {navigationItem.name}
        </span>
      </AccordionComponents.AccordionTrigger>
      {Boolean(navigationItem.children?.length) && (
        <AccordionComponents.AccordionContent className="pl-4">
          <CategoryNavigationItemTier2
            tier2Items={navigationItem.children ?? []}
          />
        </AccordionComponents.AccordionContent>
      )}
    </AccordionComponents.AccordionItem>
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
    <AccordionComponents.Accordion type="multiple">
      {tier2Items.map((tier2Item) => (
        <AccordionComponents.AccordionItem
          value={tier2Item.name}
          key={tier2Item.id}
        >
          <AccordionComponents.AccordionTrigger
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
          </AccordionComponents.AccordionTrigger>
          {Boolean(tier2Item.children?.length) && (
            <AccordionComponents.AccordionContent className="flex flex-col gap-2 pl-4">
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
            </AccordionComponents.AccordionContent>
          )}
        </AccordionComponents.AccordionItem>
      ))}
    </AccordionComponents.Accordion>
  );
}
