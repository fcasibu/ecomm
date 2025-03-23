'use client';

import { useCurrentLocale, useScopedI18n } from '@/locales/client';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/sanity/queries/content-page/types';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@ecomm/ui/breadcrumb';
import { Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import { ConditionalLink } from './link';
import { link } from '@/lib/utils/link-helper';
import { cn } from '@ecomm/ui/lib/utils';

export function ContentPageBreadcrumb({
  data,
}: {
  data: BreadcrumbItemType[];
}) {
  const pathname = usePathname();
  const locale = useCurrentLocale();

  const t = useScopedI18n('breadcrumb.home');

  const breadcrumb = createBreadcrumb(data, pathname, t('label'), locale);

  return (
    <Breadcrumb className="container my-4">
      <BreadcrumbList>
        {breadcrumb.map(({ label, icon: Icon, link }, index) => {
          const isCurrentPath = `/${locale}${link.url}` === pathname;

          return (
            <Fragment key={`${label}-${index}`}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <ConditionalLink href={isCurrentPath ? null : link.url}>
                    <div className="flex items-center gap-2">
                      {Icon && <Icon size={15} />}
                      <span
                        className={cn({
                          'font-bold': isCurrentPath,
                        })}
                      >
                        {label}
                      </span>
                    </div>
                  </ConditionalLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index !== breadcrumb.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function createBreadcrumb(
  data: BreadcrumbItemType[],
  currentPath: string,
  homeLabel: string,
  locale: string,
) {
  const breadcrumb = data
    .filter((item) => Boolean(item.label))
    .map((item) => ({ ...item, icon: null as unknown as React.ElementType }));

  if (!breadcrumb.length) return [];

  if (currentPath !== `${link.home}${locale}`) {
    breadcrumb.unshift({
      icon: Home,
      label: homeLabel,
      link: {
        url: '/',
        newTab: false,
        title: '',
      },
    });
  }

  return breadcrumb;
}
